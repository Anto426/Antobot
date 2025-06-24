import mysql from "mysql2/promise";
import BotConsole from "../console/BotConsole.js";

class SqlManager {
  constructor() {
    this.pool = null;
    this.config = null;
  }

  async connect(config) {
    if (this.pool) {
      BotConsole.warning(
        "SqlManager.connect: Pool MySQL già esistente. Verifica..."
      );
      try {
        const conn = await this.pool.getConnection();
        conn.release();
        BotConsole.success("Pool MySQL esistente verificata.");
        return;
      } catch (e) {
        BotConsole.error(
          "Errore verificando pool esistente. Tento ricreazione.",
          e
        );
        this.pool = null;
      }
    }
    if (!config || !config.host || !config.user || !config.database) {
      BotConsole.error("Configurazione MySQL incompleta.", config);
      throw new Error("Configurazione MySQL incompleta.");
    }
    try {
      this.pool = mysql.createPool({
        supportBigNumbers: true,
        bigNumberStrings: true,
        ...config,
        waitForConnections: true,
        connectionLimit: config.connectionLimit || 10,
        queueLimit: 0,
        dateStrings: true,
      });
      this.config = config;
      this.pool.on("connection", (c) =>
        BotConsole.info(`MySQL Pool: Nuova connessione ${c.threadId}`)
      );
      this.pool.on("error", (err) =>
        BotConsole.error("MySQL Pool Error:", err)
      );
      const conn = await this.pool.getConnection();
      BotConsole.success(
        `Test MySQL (Host: ${this.config.host}, DB: ${this.config.database}) OK. Rilasciata ${conn.threadId}.`
      );
      conn.release();
      BotConsole.success("Pool MySQL inizializzata.");
    } catch (err) {
      BotConsole.error(
        `Errore init Pool MySQL (Host: ${config.host}, DB: ${config.database}):`,
        err
      );
      this.pool = null;
      throw err;
    }
  }

  async getConnection() {
    if (!this.pool)
      throw new Error("Pool MySQL non inizializzata in getConnection.");
    return this.pool.getConnection();
  }
  async addLog(logData) {
    if (logData.DETAILS && typeof logData.DETAILS !== "string") {
      logData.DETAILS = JSON.stringify(logData.DETAILS, null, 2);
    }
    return this._genericInsert("LOGS", logData);
  }

  async _executeQuery(query, params = []) {
    if (!this.pool)
      throw new Error("Pool MySQL non inizializzata in _executeQuery.");
    BotConsole.debug(`SQL Exec: ${query} -- PARAMS: ${JSON.stringify(params)}`);
    try {
      const [results, fields] = await this.pool.query(query, params);
      return [results, fields];
    } catch (err) {
      BotConsole.error(
        `Errore query SQL: ${query} -- Params: ${JSON.stringify(params)}`,
        err
      );
      throw err;
    }
  }

  async _getOne(query, params = []) {
    const [rows] = await this._executeQuery(query, params);
    return rows[0] || null;
  }
  async _getAllRows(query, params = []) {
    const [rows] = await this._executeQuery(query, params);
    return rows;
  }

  async _exists(table, whereConditions) {
    const fields = Object.keys(whereConditions);
    if (fields.length === 0) return false;

    const whereClause = fields.map((field) => `\`${field}\` = ?`).join(" AND ");
    const params = fields.map((field) => whereConditions[field]);

    const query = `SELECT 1 FROM \`${table}\` WHERE ${whereClause} LIMIT 1`;

    const row = await this._getOne(query, params);

    return !!row; // Restituisce true se la riga esiste, false altrimenti
  }

  async _genericInsert(table, data, uniqueKeyFields = ["ID"]) {
    const keys = Object.keys(data).filter((k) => data[k] !== undefined);
    const values = keys.map((k) => data[k]);
    if (keys.length === 0)
      return {
        affectedRows: 0,
        operation: "no_data",
        warning: "Nessun dato per insert.",
      };
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO \`${table}\` (\`${keys.join(
      "`, `"
    )}\`) VALUES (${placeholders})`;
    try {
      const [result] = await this._executeQuery(sql, values);
      return { ...result, operation: "inserted" };
    } catch (err) {
      if (err && err.code === "ER_DUP_ENTRY") {
        const uniqueValues = uniqueKeyFields
          .map((k) => data[k] ?? "N/A")
          .join("-");
        BotConsole.warning(
          `[${table}] Entità chiave ~${uniqueValues} già esistente (ER_DUP_ENTRY).`
        );
        return {
          affectedRows: 0,
          operation: "exists",
          existing: true,
          code: "ER_DUP_ENTRY",
          message: err.message,
        };
      }
      BotConsole.error(
        `[${table} - _genericInsert] Errore SQL non ER_DUP_ENTRY:`,
        err.message
      );
      throw err;
    }
  }

  async _getByIdGeneric(table, idColumn, id) {
    return this._getOne(
      `SELECT * FROM \`${table}\` WHERE \`${idColumn}\` = ?`,
      [id]
    );
  }
  async _getAllGeneric(table) {
    return this._getAllRows(`SELECT * FROM \`${table}\``);
  }
  async _deleteByIdGeneric(table, idColumn, id) {
    const [res] = await this._executeQuery(
      `DELETE FROM \`${table}\` WHERE \`${idColumn}\` = ?`,
      [id]
    );
    return res;
  }
  async _updateByIdGeneric(table, idColumn, id, fields) {
    const validFields = Object.keys(fields).filter(
      (k) => fields[k] !== undefined
    );
    if (validFields.length === 0)
      return {
        affectedRows: 0,
        message: "Nessun campo valido per update.",
        operation: "no_change",
      };
    const values = validFields.map((k) => fields[k]);
    const setClause = validFields.map((k) => `\`${k}\` = ?`).join(", ");
    const sql = `UPDATE \`${table}\` SET ${setClause} WHERE \`${idColumn}\` = ?`;
    const [result] = await this._executeQuery(sql, [...values, id]);
    return { ...result, operation: "updated" };
  }

  async getGuildsWithLogChannel() {
    const query =
      "SELECT ID, LOG_ID FROM `GUILD` WHERE LOG_ID IS NOT NULL AND LOG_ID <> ''";
    return this._getAllRows(query);
  }

  async synchronizeGuild(guildData) {
    const { id, name, ...otherFields } = guildData;
    const existingGuild = await this.getGuildById(id);
    const guildRecordData = { ID: id, NOME: name };

    for (const key of [
      "TEMPCHANNEL_ID",
      "HOLYDAY_ID",
      "WELCOME_ID",
      "LOG_ID",
      "ROLEDEFAULT_ID",
      "ROLEBOTDEFAULT_ID",
    ]) {
      if (otherFields[key] !== undefined) {
        guildRecordData[key] = otherFields[key];
      }
    }

    if (!existingGuild) {
      BotConsole.debug(
        `[Sync] Gilda ${name} (${id}) non trovata. Aggiunta: ${JSON.stringify(
          guildRecordData
        )}`
      );
      return this.addGuild(guildRecordData);
    } else {
      const fieldsToUpdate = {};
      if (guildRecordData.NOME !== existingGuild.NOME)
        fieldsToUpdate.NOME = guildRecordData.NOME;
      for (const key of [
        "TEMPCHANNEL_ID",
        "HOLYDAY_ID",
        "WELCOME_ID",
        "LOG_ID",
        "ROLEDEFAULT_ID",
        "ROLEBOTDEFAULT_ID",
      ]) {
        if (
          guildRecordData[key] !== undefined &&
          guildRecordData[key] !== existingGuild[key]
        ) {
          fieldsToUpdate[key] = guildRecordData[key];
        }
      }
      if (Object.keys(fieldsToUpdate).length > 0) {
        BotConsole.debug(
          `[Sync] Gilda ${id}. Aggiornamento con: ${JSON.stringify(
            fieldsToUpdate
          )}`
        );
        return this.updateGuild(id, fieldsToUpdate);
      }
      BotConsole.debug(`[Sync] Gilda ${name} (${id}) senza modifiche.`);
      return { operation: "no_change", data: existingGuild, id: id };
    }
  }

  async synchronizeRole(roleDataInput) {
    /* ... come ultima versione ... */
    const { id, name, color, guildId } = roleDataInput;
    const hexColor = color
      ? `#${color.toString(16).padStart(6, "0").toUpperCase()}`
      : null;
    const existingRole = await this.getRoleById(id);
    const roleDataForDb = {
      ID: id,
      NOME: name,
      COLORE: hexColor,
      IDGUILD: guildId,
    };

    if (!existingRole) {
      return this.addRole(roleDataForDb);
    }
    if (
      existingRole.NOME !== name ||
      existingRole.COLORE !== hexColor ||
      existingRole.IDGUILD !== guildId
    ) {
      return this.updateRole(id, {
        NOME: name,
        COLORE: hexColor,
        IDGUILD: guildId,
      });
    }
    return { operation: "no_change", data: existingRole, id: id };
  }

  async synchronizeGlobalMember({ id, globalName }) {
    const existingMember = await this.getMemberById(id);
    const memberDataForDb = { ID: id, NOME: globalName };

    if (!existingMember) {
      return this._genericInsert("MEMBER", memberDataForDb);
    }

    if (existingMember.NOME !== globalName) {
      return this.updateMember(id, { NOME: globalName });
    }

    return { operation: "no_change", data: existingMember, id: id };
  }

  async ensureGuildMemberAssociation(guildId, memberId) {
    const alreadyExists = await this._exists("GUILD_MEMBER", {
      GUILD_ID: guildId,
      MEMBER_ID: memberId,
    });

    if (alreadyExists) {
      return {
        operation: "exists",
        message: "Associazione gilda-membro già presente.",
      };
    }

    return this._genericInsert("GUILD_MEMBER", {
      GUILD_ID: guildId,
      MEMBER_ID: memberId,
    });
  }
  async synchronizeMemberRolesForGuild(
    memberId,
    guildId,
    discordMemberRoleIdsSet
  ) {
    const allDbRolesForMemberGlobally = await this.getRolesOfMember(memberId);
    const dbMemberRoleIdsInThisGuild = new Set(
      allDbRolesForMemberGlobally
        .filter((role) => role.IDGUILD === guildId)
        .map((role) => role.ID)
    );
    let addedCount = 0,
      removedCount = 0;
    const results = {
      added: [],
      removed: [],
      no_change_exists: [],
      failed_to_add_role_not_found: [],
    };

    for (const discordRoleId of discordMemberRoleIdsSet) {
      if (!dbMemberRoleIdsInThisGuild.has(discordRoleId)) {
        if (await this.roleExists(discordRoleId)) {
          const addResult = await this.addMemberRole({
            MEMBER_ID: memberId,
            ROLE_ID: discordRoleId,
          });
          if (addResult.operation === "inserted") {
            addedCount++;
            results.added.push(discordRoleId);
          } else if (addResult.existing)
            results.no_change_exists.push(discordRoleId);
        } else results.failed_to_add_role_not_found.push(discordRoleId);
      } else results.no_change_exists.push(discordRoleId);
    }
    for (const dbRoleId of dbMemberRoleIdsInThisGuild) {
      if (!discordMemberRoleIdsSet.has(dbRoleId)) {
        await this.deleteMemberRole(memberId, dbRoleId);
        removedCount++;
        results.removed.push(dbRoleId);
      }
    }
    return {
      memberId,
      guildId,
      rolesAdded: addedCount,
      rolesRemoved: removedCount,
      ...results,
    };
  }

  async addGuild(data) {
    return this._genericInsert("GUILD", data, ["ID"]);
  }
  async getGuildById(id) {
    return this._getByIdGeneric("GUILD", "ID", id);
  }
  async getAllGuilds() {
    return this._getAllGeneric("GUILD");
  }
  async updateGuild(id, fields) {
    return this._updateByIdGeneric("GUILD", "ID", id, fields);
  }
  async deleteGuild(id) {
    return this._deleteByIdGeneric("GUILD", "ID", id);
  }
  async guildExists(id) {
    return !!(await this.getGuildById(id));
  }

  async addTempChannel(data) {
    return this._genericInsert("TEMP_CHANNEL", data, ["ID"]);
  }
  async getTempChannelById(id) {
    return this._getByIdGeneric("TEMP_CHANNEL", "ID", id);
  }
  async getAllTempChannels() {
    return this._getAllGeneric("TEMP_CHANNEL");
  }
  async updateTempChannel(id, fields) {
    return this._updateByIdGeneric("TEMP_CHANNEL", "ID", id, fields);
  }
  async deleteTempChannel(id) {
    return this._deleteByIdGeneric("TEMP_CHANNEL", "ID", id);
  }

  async addHollyday(data) {
    return this._genericInsert("HOLYDAY", data, ["ID"]);
  }
  async getHollydayById(id) {
    return this._getByIdGeneric("HOLYDAY", "ID", id);
  }
  async getAllHollydays() {
    return this._getAllGeneric("HOLYDAY");
  }
  async updateHollyday(id, fields) {
    return this._updateByIdGeneric("HOLYDAY", "ID", id, fields);
  }
  async deleteHollyday(id) {
    return this._deleteByIdGeneric("HOLYDAY", "ID", id);
  }

  async addRole(data) {
    return this._genericInsert("ROLE", data, ["ID"]);
  }
  async getRoleById(id) {
    return this._getByIdGeneric("ROLE", "ID", id);
  }
  async getAllRoles() {
    return this._getAllGeneric("ROLE");
  }
  async getRolesByGuild(guildId) {
    return this._getAllRows("SELECT * FROM `ROLE` WHERE `IDGUILD` = ?", [
      guildId,
    ]);
  }
  async updateRole(id, fields) {
    return this._updateByIdGeneric("ROLE", "ID", id, fields);
  }
  async deleteRole(id) {
    return this._deleteByIdGeneric("ROLE", "ID", id);
  }
  async roleExists(id) {
    return !!(await this.getRoleById(id));
  }

  async addMember(data) {
    return this._genericInsert("MEMBER", data, ["ID"]);
  }
  async getMemberById(id) {
    return this._getByIdGeneric("MEMBER", "ID", id);
  }
  async getAllMembers() {
    return this._getAllGeneric("MEMBER");
  }
  async updateMember(id, fields) {
    return this._updateByIdGeneric("MEMBER", "ID", id, fields);
  }
  async deleteMember(id) {
    return this._deleteByIdGeneric("MEMBER", "ID", id);
  }
  async memberExists(id) {
    return !!(await this.getMemberById(id));
  }

  async addGuildMember(data) {
    return this._genericInsert("GUILD_MEMBER", data, ["GUILD_ID", "MEMBER_ID"]);
  }
  async removeMemberFromGuild(guildId, memberId) {
    const [r] = await this._executeQuery(
      "DELETE FROM `GUILD_MEMBER` WHERE `GUILD_ID` = ? AND `MEMBER_ID` = ?",
      [guildId, memberId]
    );
    return r;
  }
  async getMembersOfGuild(guildId) {
    return this._getAllRows(
      `SELECT m.* FROM \`MEMBER\` m JOIN \`GUILD_MEMBER\` gm ON m.ID = gm.MEMBER_ID WHERE gm.GUILD_ID = ?`,
      [guildId]
    );
  }
  async getGuildsOfMember(memberId) {
    return this._getAllRows(
      `SELECT g.* FROM \`GUILD\` g JOIN \`GUILD_MEMBER\` gm ON g.ID = gm.GUILD_ID WHERE gm.MEMBER_ID = ?`,
      [memberId]
    );
  }
  async isMemberInGuild(guildId, memberId) {
    return !!(await this._getOne(
      "SELECT 1 FROM `GUILD_MEMBER` WHERE `GUILD_ID` = ? AND `MEMBER_ID` = ? LIMIT 1",
      [guildId, memberId]
    ));
  }

  async addMemberRole(data) {
    return this._genericInsert("MEMBER_ROLE", data, ["MEMBER_ID", "ROLE_ID"]);
  }
  async getMemberRole(memberId, roleId) {
    return this._getOne(
      "SELECT * FROM `MEMBER_ROLE` WHERE `MEMBER_ID` = ? AND `ROLE_ID` = ?",
      [memberId, roleId]
    );
  }
  async getAllMemberRoles() {
    return this._getAllGeneric("MEMBER_ROLE");
  }
  async deleteMemberRole(memberId, roleId) {
    const [r] = await this._executeQuery(
      "DELETE FROM `MEMBER_ROLE` WHERE `MEMBER_ID` = ? AND `ROLE_ID` = ?",
      [memberId, roleId]
    );
    return r;
  }
  async getRolesOfMember(memberId) {
    return this._getAllRows(
      `SELECT r.* FROM \`ROLE\` r JOIN \`MEMBER_ROLE\` mr ON r.ID = mr.ROLE_ID WHERE mr.MEMBER_ID = ?`,
      [memberId]
    );
  }
  async getMembersWithRole(roleId) {
    return this._getAllRows(
      `SELECT m.* FROM \`MEMBER\` m JOIN \`MEMBER_ROLE\` mr ON m.ID = mr.MEMBER_ID WHERE mr.ROLE_ID = ?`,
      [roleId]
    );
  }

  async getLogById(id) {
    return this._getByIdGeneric("LOGS", "ID", id);
  }

  async getAllLogs() {
    return this._getAllGeneric("LOGS");
  }

  async getLogsByGuild(
    guildId,
    {
      limit = 50,
      offset = 0,
      orderBy = "CREATED_AT",
      orderDirection = "DESC",
    } = {}
  ) {
    const validCols = ["ID", "LOG_TYPE", "CREATED_AT"];
    const safeOB = validCols.includes(orderBy.toUpperCase())
      ? orderBy
      : "CREATED_AT";
    const safeOD = orderDirection.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const query = `
            SELECT * FROM \`LOGS\` 
            WHERE \`ID_GUILD\` = ? 
            ORDER BY \`${safeOB}\` ${safeOD} 
            LIMIT ? OFFSET ?
        `;
    return this._getAllRows(query, [guildId, limit, offset]);
  }

  async updateLog(id, fields) {
    if (fields.DETAILS && typeof fields.DETAILS !== "string") {
      fields.DETAILS = JSON.stringify(fields.DETAILS, null, 2);
    }
    return this._updateByIdGeneric("LOGS", "ID", id, fields);
  }

  async deleteLog(id) {
    return this._deleteByIdGeneric("LOGS", "ID", id);
  }

  async beginTransaction() {
    try {
      const c = await this.getConnection();
      await c.beginTransaction();
      BotConsole.info(`TXN Begin (Conn ${c.threadId})`);
      return c;
    } catch (e) {
      BotConsole.error("TXN Begin Err", e);
      throw e;
    }
  }
  async commit(c) {
    if (!c) {
      BotConsole.error("Commit No Conn");
      throw new Error("No Conn");
    }
    try {
      await c.commit();
      BotConsole.success(`TXN Commit (Conn ${c.threadId})`);
    } catch (e) {
      BotConsole.error(`TXN Commit Err (Conn ${c.threadId})`, e);
      throw e;
    } finally {
      if (c && c.release) c.release();
    }
  }
  async rollback(c) {
    if (!c) {
      BotConsole.error("Rollback No Conn");
      throw new Error("No Conn");
    }
    try {
      await c.rollback();
      BotConsole.warning(`TXN Rollback (Conn ${c.threadId})`);
    } catch (e) {
      BotConsole.error(`TXN Rollback Err (Conn ${c.threadId})`, e);
    } finally {
      if (c && c.release) c.release();
    }
  }

  async closePool() {
    if (this.pool) {
      try {
        await this.pool.end();
        BotConsole.success("MySQL Pool closed.");
        this.pool = null;
      } catch (err) {
        BotConsole.error("MySQL Pool close error:", err);
      }
    } else BotConsole.warning("MySQL Pool close attempt on uninit pool.");
  }
}

export default new SqlManager();
