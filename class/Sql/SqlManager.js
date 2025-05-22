import mysql from "mysql2/promise";
import BotConsole from "../console/BotConsole.js"; // Assicurati che il percorso sia corretto

class SqlManager {
  constructor() {
    this.pool = null;
    this.config = null;
    BotConsole.info("Istanza di SqlManager creata.");
  }

  async connect(config) {
    if (this.pool) {
      BotConsole.warning(
        "Tentativo di riconnessione, ma una pool MySQL esiste già."
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
    if (!config) {
      BotConsole.error("Config MySQL mancante per la connessione.");
      throw new Error("Config MySQL mancante.");
    }
    try {
      this.pool = mysql.createPool({
        supportBigNumbers: true,
        bigNumberStrings: true,
        ...config,
        waitForConnections: true,
        connectionLimit: config.connectionLimit || 10,
        queueLimit: 0,
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
        `Test MySQL (host: ${this.config.host}, db: ${this.config.database}) OK. Rilasciata ${conn.threadId}.`
      );
      conn.release();
      BotConsole.success("Pool MySQL inizializzata e testata.");
    } catch (err) {
      BotConsole.error(
        `Errore Conn/Test MySQL (host: ${config.host}, db: ${config.database}):`,
        err
      );
      this.pool = null;
      throw err;
    }
  }

  async getConnection() {
    if (!this.pool) throw new Error("Pool non inizializzata in getConnection.");
    return this.pool.getConnection();
  }

  async _executeQuery(query, params = []) {
    if (!this.pool) throw new Error("Pool non inizializzata in _executeQuery.");
    // BotConsole.debug(`SQL Exec: ${query} -- PARAMS: ${JSON.stringify(params)}`);
    try {
      const [results, fields] = await this.pool.query(query, params);
      return [results, fields];
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        BotConsole.debug(
          `Query SQL ha prodotto ER_DUP_ENTRY (sarà gestito): ${query} -- Params: ${JSON.stringify(
            params
          )}`,
          err.message
        );
      } else {
        BotConsole.error(
          `Errore query SQL: ${query} -- Params: ${JSON.stringify(params)}`,
          err 
        );
      }
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

  // In SqlManager.js

  async _genericInsert(table, data, uniqueKeyFields = ["ID"]) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) {
      BotConsole.warn(
        `_genericInsert chiamato per la tabella ${table} senza dati.`
      );
      return {
        affectedRows: 0,
        operation: "no_data",
        warning: "Nessun dato fornito per l'inserimento.",
      };
    }
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO \`${table}\` (\`${keys.join(
      "`, `"
    )}\`) VALUES (${placeholders})`;
    try {
      const [result] = await this._executeQuery(sql, values);
      BotConsole.debug(
        `_genericInsert successo per ${table}: ${JSON.stringify(data)}`
      );
      return { ...result, operation: "inserted" };
    } catch (err) {
      // Questo è il catch che deve gestire ER_DUP_ENTRY
      BotConsole.debug(
        `[${table} - _genericInsert CATCH] Errore catturato: Code: ${err.code}, Message: ${err.message}`
      ); // <-- NUOVO LOG DI DEBUG

      if (err && err.code === "ER_DUP_ENTRY") {
        // Aggiunto controllo 'err &&' per sicurezza
        const uniqueValuesForMessage = uniqueKeyFields
          .map((k) => (data[k] !== undefined ? data[k] : "N/A"))
          .join("-");
        BotConsole.warning(
          `[${table}] Entità con chiave ~${uniqueValuesForMessage} già esistente (ER_DUP_ENTRY gestito internamente).`
        );
        return {
          affectedRows: 0,
          operation: "exists",
          existing: true,
          code: "ER_DUP_ENTRY",
          message: err.message,
        };
      }

      // Se non è ER_DUP_ENTRY, o se err è null/undefined (improbabile ma per sicurezza)
      // il log è già avvenuto in _executeQuery. Qui semplicemente rilanciamo.
      BotConsole.error(
        `[${table} - _genericInsert CATCH] Errore SQL non gestito (non ER_DUP_ENTRY) o errore imprevisto:`,
        err.message
      );
      throw err; // Rilancia errori non ER_DUP_ENTRY
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
        message: "Nessun campo valido per l'aggiornamento.",
      };
    const values = validFields.map((k) => fields[k]);
    const setClause = validFields.map((k) => `\`${k}\` = ?`).join(", ");
    const sql = `UPDATE \`${table}\` SET ${setClause} WHERE \`${idColumn}\` = ?`;
    const [result] = await this._executeQuery(sql, [...values, id]);
    return result;
  }

  // --- METODI DI SINCRONIZZAZIONE DI ALTO LIVELLO ---
  async synchronizeGuild(guildDiscordData) {
    const { id, name } = guildDiscordData;
    const existingGuild = await this.getGuildById(id);
    const guildDataForDb = { ID: id, NOME: name };

    if (!existingGuild) {
      BotConsole.debug(`[Sync] Gilda ${name} (${id}) non trovata. Aggiunta...`);
      return this.addGuild(guildDataForDb); // addGuild usa _genericInsert
    }
    if (existingGuild.NOME !== name) {
      BotConsole.debug(
        `[Sync] Gilda ${id}: Nome cambiato da "${existingGuild.NOME}" a "${name}". Aggiornamento...`
      );
      const updateResult = await this.updateGuild(id, { NOME: name });
      return { ...updateResult, operation: "updated", id: id };
    }
    BotConsole.debug(`[Sync] Gilda ${name} (${id}) trovata e senza modifiche.`);
    return { operation: "no_change", data: existingGuild, id: id };
  }

  async synchronizeRole(roleDiscordData) {
    const { id, name, color, guildId } = roleDiscordData; // Assumiamo che guildId sia fornito
    const hexColor = color
      ? `#${(typeof color === "number" ? color : parseInt(color, 10))
          .toString(16)
          .padStart(6, "0")
          .toUpperCase()}`
      : null;
    const existingRole = await this.getRoleById(id);
    const roleData = { ID: id, NOME: name, COLORE: hexColor, IDGUILD: guildId };

    if (!existingRole) {
      BotConsole.debug(
        `[Sync] Ruolo ${name} (${id}) [Gilda: ${guildId}] non trovato. Aggiunta...`
      );
      return this.addRole(roleData);
    }
    if (
      existingRole.NOME !== name ||
      existingRole.COLORE !== hexColor ||
      existingRole.IDGUILD !== guildId
    ) {
      BotConsole.debug(
        `[Sync] Ruolo ${id} [Gilda: ${guildId}] trovato. Dati cambiati. Aggiornamento...`
      );
      const updateResult = await this.updateRole(id, {
        NOME: name,
        COLORE: hexColor,
        IDGUILD: guildId,
      });
      return { ...updateResult, operation: "updated", id: id };
    }
    BotConsole.debug(
      `[Sync] Ruolo ${name} (${id}) [Gilda: ${guildId}] trovato e senza modifiche.`
    );
    return { operation: "no_change", data: existingRole, id: id };
  }

  async synchronizeGlobalMember(memberDiscordData) {
    const { id, globalName } = memberDiscordData;
    const existingMember = await this.getMemberById(id);
    const memberData = { ID: id, NOME: globalName };

    if (!existingMember) {
      BotConsole.debug(
        `[Sync] Membro globale ${globalName} (${id}) non trovato. Aggiunta...`
      );
      return this.addMember(memberData);
    }
    if (existingMember.NOME !== globalName) {
      BotConsole.debug(
        `[Sync] Membro globale ${id}: Nome cambiato da "${existingMember.NOME}" a "${globalName}". Aggiornamento...`
      );
      const updateResult = await this.updateMember(id, { NOME: globalName });
      return { ...updateResult, operation: "updated", id: id };
    }
    BotConsole.debug(
      `[Sync] Membro globale ${globalName} (${id}) trovato e senza modifiche.`
    );
    return { operation: "no_change", data: existingMember, id: id };
  }

  async ensureGuildMemberAssociation(guildId, memberId) {
    BotConsole.debug(
      `[Sync] Assicurando associazione Gilda ${guildId} - Membro ${memberId}`
    );
    const result = await this.addGuildMember({
      GUILD_ID: guildId,
      MEMBER_ID: memberId,
    }); // addGuildMember usa _genericInsert
    if (result.existing) {
      BotConsole.debug(
        `[Sync] Associazione Gilda ${guildId} - Membro ${memberId} già esistente (gestito).`
      );
    } else if (result.operation === "inserted") {
      BotConsole.success(
        `[Sync] Associazione Gilda ${guildId} - Membro ${memberId} creata.`
      );
    }
    return result;
  }

  async synchronizeMemberRolesForGuild(
    memberId,
    guildId,
    discordMemberRoleIdsSet
  ) {
    BotConsole.debug(
      `[Sync] Sincronizzazione ruoli per Membro ${memberId} in Gilda ${guildId}. Ruoli Discord: ${[
        ...discordMemberRoleIdsSet,
      ].join(", ")}`
    );
    const allDbRolesForMemberGlobally = await this.getRolesOfMember(memberId);
    const dbMemberRoleIdsInThisGuild = new Set(
      allDbRolesForMemberGlobally
        .filter((role) => role.IDGUILD === guildId)
        .map((role) => role.ID)
    );
    BotConsole.debug(
      `[Sync] Ruoli DB per Membro ${memberId} in Gilda ${guildId}: ${[
        ...dbMemberRoleIdsInThisGuild,
      ].join(", ")}`
    );

    let addedCount = 0;
    let removedCount = 0;

    for (const discordRoleId of discordMemberRoleIdsSet) {
      if (!dbMemberRoleIdsInThisGuild.has(discordRoleId)) {
        if (await this.roleExists(discordRoleId)) {
          const addResult = await this.addMemberRole({
            MEMBER_ID: memberId,
            ROLE_ID: discordRoleId,
          });
          if (addResult.operation === "inserted") addedCount++;
        } else {
          BotConsole.warning(
            `[Sync] Ruolo ${discordRoleId} non esiste nel DB. Impossibile assegnare a Membro ${memberId} in Gilda ${guildId}.`
          );
        }
      }
    }

    for (const dbRoleId of dbMemberRoleIdsInThisGuild) {
      if (!discordMemberRoleIdsSet.has(dbRoleId)) {
        await this.deleteMemberRole(memberId, dbRoleId);
        removedCount++;
        BotConsole.info(
          `[Sync] Ruolo ${dbRoleId} rimosso da Membro ${memberId} in Gilda ${guildId}.`
        );
      }
    }
    const summary = {
      memberId,
      guildId,
      rolesAdded: addedCount,
      rolesRemoved: removedCount,
    };
    if (addedCount > 0 || removedCount > 0)
      BotConsole.info(
        `[Sync] Riepilogo ruoli per ${memberId} in ${guildId}: Aggiunti ${addedCount}, Rimossi ${removedCount}.`
      );
    else
      BotConsole.debug(
        `[Sync] Nessuna modifica ai ruoli per ${memberId} in ${guildId}.`
      );
    return summary;
  }

  // --- GUILD ---
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

  // --- TEMP_CHANNEL ---
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

  // --- HOLLYDAY ---
  async addHollyday(data) {
    return this._genericInsert("HOLLYDAY", data, ["ID"]);
  }
  async getHollydayById(id) {
    return this._getByIdGeneric("HOLLYDAY", "ID", id);
  }
  async getAllHollydays() {
    return this._getAllGeneric("HOLLYDAY");
  }
  async updateHollyday(id, fields) {
    return this._updateByIdGeneric("HOLLYDAY", "ID", id, fields);
  }
  async deleteHollyday(id) {
    return this._deleteByIdGeneric("HOLLYDAY", "ID", id);
  }

  // --- ROLE ---
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

  // --- MEMBER (Utenti Globali) ---
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

  // --- GUILD_MEMBER ---
  async addGuildMember(data) {
    return this._genericInsert("GUILD_MEMBER", data, ["GUILD_ID", "MEMBER_ID"]);
  } // Usato da ensureGuildMemberAssociation
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

  // --- MEMBER_ROLE ---
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

  // --- LOG ---
  async addLog(data) {
    return this._genericInsert("LOG", data, ["ID"]);
  }
  async getLogById(id) {
    return this._getByIdGeneric("LOG", "ID", id);
  }
  async getAllLogs() {
    return this._getAllGeneric("LOG");
  }
  async getLogsByGuild(
    guildId,
    { limit = 50, offset = 0, orderBy = "ID", orderDirection = "DESC" } = {}
  ) {
    const validCols = ["ID", "TYPE"];
    const safeOB = validCols.includes(orderBy.toUpperCase()) ? orderBy : "ID";
    const safeOD = orderDirection.toUpperCase() === "ASC" ? "ASC" : "DESC";
    return this._getAllRows(
      `SELECT * FROM \`LOG\` WHERE \`ID_GUILD\` = ? ORDER BY \`${safeOB}\` ${safeOD} LIMIT ? OFFSET ?`,
      [guildId, limit, offset]
    );
  }
  async updateLog(id, fields) {
    return this._updateByIdGeneric("LOG", "ID", id, fields);
  }
  async deleteLog(id) {
    return this._deleteByIdGeneric("LOG", "ID", id);
  }

  // Transaction helpers
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
    if (!c) throw new Error("No conn for commit");
    try {
      await c.commit();
      BotConsole.success(`TXN Commit (Conn ${c.threadId})`);
    } catch (e) {
      BotConsole.error(`TXN Commit Err (Conn ${c.threadId})`, e);
      throw e;
    } finally {
      c.release();
      BotConsole.info(`Conn ${c.threadId} released`);
    }
  }
  async rollback(c) {
    if (!c) throw new Error("No conn for rollback");
    try {
      await c.rollback();
      BotConsole.warning(`TXN Rollback (Conn ${c.threadId})`);
    } catch (e) {
      BotConsole.error(`TXN Rollback Err (Conn ${c.threadId})`, e);
    } finally {
      c.release();
      BotConsole.info(`Conn ${c.threadId} released`);
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
