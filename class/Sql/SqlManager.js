import mysql from "mysql2/promise";
import BotConsole from "../console/BotConsole.js"; // Adatta il percorso

class SqlManager {
  constructor() {
    this.pool = null;
    this.config = null;
    BotConsole.info("Istanza di SqlManager creata.");
  }

  async connect(config) {
    if (this.pool) {
      BotConsole.warning("SqlManager.connect chiamato ma una pool MySQL esiste già. Verifica integrità pool...");
      try {
        const conn = await this.pool.getConnection();
        conn.release();
        BotConsole.success("Pool MySQL esistente verificata con successo e funzionante.");
        return;
      } catch (e) {
        BotConsole.error("Errore nel verificare la pool MySQL esistente. Verrà tentata una nuova creazione.", e);
        this.pool = null; // Forza la ricreazione
      }
    }

    if (!config || !config.host || !config.user || !config.database) {
      BotConsole.error("Configurazione MySQL (host, user, database) incompleta o mancante.", config);
      throw new Error("Configurazione MySQL incompleta o mancante.");
    }

    try {
      this.pool = mysql.createPool({
        supportBigNumbers: true,  // Mantenuto per coerenza, anche se IDs sono VARCHAR
        bigNumberStrings: true,   // Mantenuto per coerenza
        ...config,                // Include host, user, password, database dalla config
        waitForConnections: true,
        connectionLimit: config.connectionLimit || 10,
        queueLimit: 0,
        dateStrings: true,        // Mantiene le date come stringhe, utile per evitare problemi di timezone
      });
      this.config = config;

      this.pool.on("connection", (connection) => {
        BotConsole.info(`MySQL Pool: Nuova connessione stabilita (ID: ${connection.threadId})`);
      });
      this.pool.on("error", (err) => {
        BotConsole.error("Errore generico nella pool MySQL:", err);
      });

      const conn = await this.pool.getConnection();
      BotConsole.info(
        `Test di connessione a MySQL (Host: ${this.config.host}, DB: ${this.config.database}) riuscito. Connessione ${conn.threadId} rilasciata.`
      );
      conn.release();
      BotConsole.success("Pool di connessioni MySQL inizializzata e testata con successo.");
    } catch (err) {
      BotConsole.error(
        `Errore CRITICO durante l'inizializzazione della pool MySQL (Host: ${config.host}, DB: ${config.database}):`,
        err
      );
      this.pool = null;
      throw err;
    }
  }

  async getConnection() {
    if (!this.pool) {
      BotConsole.error("Pool non inizializzata in getConnection. Chiamare connect() prima.");
      throw new Error("Pool MySQL non inizializzata.");
    }
    return this.pool.getConnection();
  }

  async _executeQuery(query, params = []) {
    if (!this.pool) {
      BotConsole.error("Pool non inizializzata in _executeQuery. Chiamare connect() prima.");
      throw new Error("Pool MySQL non inizializzata.");
    }
    BotConsole.debug(`SQL Esecuzione: ${query} -- Params: ${JSON.stringify(params)}`);
    try {
      const [results, fields] = await this.pool.query(query, params);
      return [results, fields];
    } catch (err) {
      BotConsole.error( // Logga sempre l'errore SQL qui per tracciabilità
        `Errore durante l'esecuzione della query SQL: ${query} -- Params: ${JSON.stringify(params)}`,
        err // Logga l'intero oggetto errore
      );
      throw err; // Rilancia sempre; la gestione specifica avverrà nel metodo chiamante se necessario
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

  async _genericInsert(table, data, uniqueKeyFields = ["ID"]) {
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    const values = keys.map(k => data[k]);

    if (keys.length === 0) {
      BotConsole.warning(`_genericInsert chiamato per tabella ${table} senza dati validi (post-undefined filter).`);
      return { affectedRows: 0, operation: "no_data", warning: "Nessun dato valido fornito per l'inserimento." };
    }
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO \`${table}\` (\`${keys.join("`, `")}\`) VALUES (${placeholders})`;
    try {
      const [result] = await this._executeQuery(sql, values);
      BotConsole.debug(`_genericInsert successo per ${table}: ${JSON.stringify(data)} -> Risultato: ${JSON.stringify(result)}`);
      return { ...result, operation: "inserted" };
    } catch (err) {
      if (err && err.code === "ER_DUP_ENTRY") {
        const uniqueValuesForMessage = uniqueKeyFields.map(k => data[k] !== undefined ? data[k] : "N/A").join("-");
        BotConsole.warning(`[${table}] Entità con chiave ~${uniqueValuesForMessage} già esistente (ER_DUP_ENTRY gestito).`);
        return { affectedRows: 0, operation: "exists", existing: true, code: "ER_DUP_ENTRY", message: err.message };
      }
      // Altri errori sono già stati loggati da _executeQuery. Rilanciamo.
      BotConsole.error(`[${table} - _genericInsert] Rilancio errore SQL non ER_DUP_ENTRY:`, err.message);
      throw err;
    }
  }

  async _getByIdGeneric(table, idColumn, id) { return this._getOne(`SELECT * FROM \`${table}\` WHERE \`${idColumn}\` = ?`, [id]); }
  async _getAllGeneric(table) { return this._getAllRows(`SELECT * FROM \`${table}\``); }
  async _deleteByIdGeneric(table, idColumn, id) { const [res] = await this._executeQuery(`DELETE FROM \`${table}\` WHERE \`${idColumn}\` = ?`, [id]); BotConsole.debug(`_deleteByIdGeneric per ${table} ID ${id}: ${JSON.stringify(res)}`); return res; }
  async _updateByIdGeneric(table, idColumn, id, fields) {
    const validFields = Object.keys(fields).filter(k => fields[k] !== undefined);
    if (validFields.length === 0) {
      BotConsole.warning(`_updateByIdGeneric chiamato per ${table} ID ${id} senza campi validi.`);
      return { affectedRows: 0, message: "Nessun campo valido per l'aggiornamento.", operation: "no_change" };
    }
    const values = validFields.map(k => fields[k]);
    const setClause = validFields.map((k) => `\`${k}\` = ?`).join(", ");
    const sql = `UPDATE \`${table}\` SET ${setClause} WHERE \`${idColumn}\` = ?`;
    const [result] = await this._executeQuery(sql, [...values, id]);
    BotConsole.debug(`_updateByIdGeneric successo per ${table} ID ${id}: ${JSON.stringify(fields)} -> Risultato: ${JSON.stringify(result)}`);
    return { ...result, operation: 'updated' };
  }

  // --- METODI DI SINCRONIZZAZIONE DI ALTO LIVELLO ---
  async synchronizeGuild(guildData) { // guildData: { id, name, TEMPCHANNEL_ID?, HOLYDAY_ID?, WELCOME_ID?, LOG_ID? }
    const { id, name, ...otherFields } = guildData;
    const existingGuild = await this.getGuildById(id);
    const guildRecordData = { ID: id, NOME: name };

    // Includi gli altri campi solo se sono definiti in guildData
    if (otherFields.TEMPCHANNEL_ID !== undefined) guildRecordData.TEMPCHANNEL_ID = otherFields.TEMPCHANNEL_ID;
    if (otherFields.HOLYDAY_ID !== undefined) guildRecordData.HOLYDAY_ID = otherFields.HOLYDAY_ID;
    if (otherFields.WELCOME_ID !== undefined) guildRecordData.WELCOME_ID = otherFields.WELCOME_ID;
    if (otherFields.LOG_ID !== undefined) guildRecordData.LOG_ID = otherFields.LOG_ID;

    if (!existingGuild) {
      BotConsole.debug(`[Sync] Gilda ${name} (${id}) non trovata. Aggiunta con: ${JSON.stringify(guildRecordData)}`);
      return this.addGuild(guildRecordData);
    } else {
      const fieldsToUpdate = {};
      if (guildRecordData.NOME !== existingGuild.NOME) fieldsToUpdate.NOME = guildRecordData.NOME;
      // Controlla e aggiungi altri campi solo se forniti e diversi
      for (const key of ['TEMPCHANNEL_ID', 'HOLYDAY_ID', 'WELCOME_ID', 'LOG_ID']) {
        if (guildRecordData[key] !== undefined && guildRecordData[key] !== existingGuild[key]) {
          fieldsToUpdate[key] = guildRecordData[key];
        }
      }

      if (Object.keys(fieldsToUpdate).length > 0) {
        BotConsole.debug(`[Sync] Gilda ${id}. Aggiornamento con: ${JSON.stringify(fieldsToUpdate)}`);
        return this.updateGuild(id, fieldsToUpdate);
      }
      BotConsole.debug(`[Sync] Gilda ${name} (${id}) trovata e senza modifiche.`);
      return { operation: 'no_change', data: existingGuild, id: id };
    }
  }

  async synchronizeRole(roleDataInput) { // roleDataInput: { id, name, color (numero), guildId }
    const { id, name, color, guildId } = roleDataInput;
    const hexColor = color ? `#${color.toString(16).padStart(6, "0").toUpperCase()}` : null;
    const existingRole = await this.getRoleById(id);
    const roleDataForDb = { ID: id, NOME: name, COLORE: hexColor, IDGUILD: guildId };

    if (!existingRole) {
      BotConsole.debug(`[Sync] Ruolo ${name} (${id}) [Gilda: ${guildId}] non trovato. Aggiunta...`);
      return this.addRole(roleDataForDb);
    }
    if (existingRole.NOME !== name || existingRole.COLORE !== hexColor || existingRole.IDGUILD !== guildId) {
      BotConsole.debug(`[Sync] Ruolo ${id} [Gilda: ${guildId}]. Aggiornamento...`);
      return this.updateRole(id, { NOME: name, COLORE: hexColor, IDGUILD: guildId });
    }
    BotConsole.debug(`[Sync] Ruolo ${name} (${id}) [Gilda: ${guildId}] senza modifiche.`);
    return { operation: 'no_change', data: existingRole, id: id };
  }

  async synchronizeGlobalMember(memberDataInput) { // memberDataInput: { id, globalName }
    const { id, globalName } = memberDataInput;
    const existingMember = await this.getMemberById(id);
    const memberDataForDb = { ID: id, NOME: globalName };

    if (!existingMember) {
      BotConsole.debug(`[Sync] Membro globale ${globalName} (${id}) non trovato. Aggiunta...`);
      return this.addMember(memberDataForDb);
    }
    if (existingMember.NOME !== globalName) {
      BotConsole.debug(`[Sync] Membro globale ${id}. Aggiornamento nome a "${globalName}"...`);
      return this.updateMember(id, { NOME: globalName });
    }
    BotConsole.debug(`[Sync] Membro globale ${globalName} (${id}) senza modifiche.`);
    return { operation: 'no_change', data: existingMember, id: id };
  }

  async ensureGuildMemberAssociation(guildId, memberId) {
    BotConsole.debug(`[Sync] Assicurando associazione Gilda ${guildId} - Membro ${memberId}`);
    // addGuildMember usa _genericInsert e gestisce ER_DUP_ENTRY
    const result = await this.addGuildMember({ GUILD_ID: guildId, MEMBER_ID: memberId });
    if (result.existing) {
      BotConsole.debug(`[Sync] Associazione Gilda ${guildId} - Membro ${memberId} già esistente.`);
    } else if (result.operation === 'inserted') {
      BotConsole.success(`[Sync] Associazione Gilda ${guildId} - Membro ${memberId} creata.`);
    }
    return result;
  }

  async synchronizeMemberRolesForGuild(memberId, guildId, discordMemberRoleIdsSet) {
    BotConsole.debug(`[Sync] Sincronizzazione ruoli per Membro ${memberId} in Gilda ${guildId}. Ruoli Discord: ${[...discordMemberRoleIdsSet].join(', ') || 'Nessuno'}`);
    const allDbRolesForMemberGlobally = await this.getRolesOfMember(memberId);
    const dbMemberRoleIdsInThisGuild = new Set(
      allDbRolesForMemberGlobally
        .filter(role => role.IDGUILD === guildId) // IDGUILD è VARCHAR
        .map(role => role.ID) // ID è VARCHAR
    );
    BotConsole.debug(`[Sync] Ruoli DB per Membro ${memberId} in Gilda ${guildId}: ${[...dbMemberRoleIdsInThisGuild].join(', ') || 'Nessuno'}`);

    let addedCount = 0;
    let removedCount = 0;
    const results = { added: [], removed: [], no_change_exists: [], failed_to_add_role_not_found: [] };


    for (const discordRoleId of discordMemberRoleIdsSet) {
      if (!dbMemberRoleIdsInThisGuild.has(discordRoleId)) {
        if (await this.roleExists(discordRoleId)) {
          const addResult = await this.addMemberRole({ MEMBER_ID: memberId, ROLE_ID: discordRoleId });
          if (addResult.operation === 'inserted') {
            addedCount++;
            results.added.push(discordRoleId);
          } else if (addResult.existing) {
            results.no_change_exists.push(discordRoleId); // Già esisteva, va bene
          }
        } else {
          BotConsole.warning(`[Sync] Ruolo ${discordRoleId} non esiste nel DB. Impossibile assegnare a Membro ${memberId} in Gilda ${guildId}.`);
          results.failed_to_add_role_not_found.push(discordRoleId);
        }
      } else {
        results.no_change_exists.push(discordRoleId);
      }
    }

    for (const dbRoleId of dbMemberRoleIdsInThisGuild) {
      if (!discordMemberRoleIdsSet.has(dbRoleId)) {
        await this.deleteMemberRole(memberId, dbRoleId);
        removedCount++;
        results.removed.push(dbRoleId);
        BotConsole.info(`[Sync] Ruolo ${dbRoleId} rimosso da Membro ${memberId} in Gilda ${guildId}.`);
      }
    }
    const summary = { memberId, guildId, rolesAdded: addedCount, rolesRemoved: removedCount, ...results };
    if(addedCount > 0 || removedCount > 0) BotConsole.info(`[Sync] Riepilogo ruoli per ${memberId} in ${guildId}: Aggiunti ${addedCount}, Rimossi ${removedCount}.`);
    else BotConsole.debug(`[Sync] Nessuna modifica ai ruoli per ${memberId} in ${guildId}.`);
    return summary;
  }

  // --- Metodi CRUD specifici per tabella ---
  // Tutti gli ID e le FK correlate sono VARCHAR(255) come da ultimo schema
  // GUILD: { ID, NOME, TEMPCHANNEL_ID?, HOLYDAY_ID?, WELCOME_ID?, LOG_ID? }
  async addGuild(data) { return this._genericInsert("GUILD", data, ['ID']); }
  async getGuildById(id) { return this._getByIdGeneric("GUILD", "ID", id); }
  async getAllGuilds() { return this._getAllGeneric("GUILD"); }
  async updateGuild(id, fields) { return this._updateByIdGeneric("GUILD", "ID", id, fields); }
  async deleteGuild(id) { return this._deleteByIdGeneric("GUILD", "ID", id); }
  async guildExists(id) { return !!(await this.getGuildById(id)); }

  // TEMP_CHANNEL: { ID, CATEGORY_CH?, DUO_CH?, TRIO_CH?, QUARTET_CH?, NOLIMIT_CH? }
  async addTempChannel(data) { return this._genericInsert("TEMP_CHANNEL", data, ['ID']); }
  async getTempChannelById(id) { return this._getByIdGeneric("TEMP_CHANNEL", "ID", id); }
  async getAllTempChannels() { return this._getAllGeneric("TEMP_CHANNEL"); }
  async updateTempChannel(id, fields) { return this._updateByIdGeneric("TEMP_CHANNEL", "ID", id, fields); }
  async deleteTempChannel(id) { return this._deleteByIdGeneric("TEMP_CHANNEL", "ID", id); }

  // HOLYDAY: { ID, CATEGORY_CH?, NAME_CHANNEL?, HOLYDAY_CHANNEL? }
  async addHollyday(data) { return this._genericInsert("HOLYDAY", data, ['ID']); }
  async getHollydayById(id) { return this._getByIdGeneric("HOLYDAY", "ID", id); }
  async getAllHollydays() { return this._getAllGeneric("HOLYDAY"); }
  async updateHollyday(id, fields) { return this._updateByIdGeneric("HOLYDAY", "ID", id, fields); }
  async deleteHollyday(id) { return this._deleteByIdGeneric("HOLYDAY", "ID", id); }

  // ROLE: { ID, NOME, COLORE?, IDGUILD }
  async addRole(data) { return this._genericInsert("ROLE", data, ['ID']); }
  async getRoleById(id) { return this._getByIdGeneric("ROLE", "ID", id); }
  async getAllRoles() { return this._getAllGeneric("ROLE"); }
  async getRolesByGuild(guildId) { return this._getAllRows("SELECT * FROM `ROLE` WHERE `IDGUILD` = ?", [guildId]); }
  async updateRole(id, fields) { return this._updateByIdGeneric("ROLE", "ID", id, fields); }
  async deleteRole(id) { return this._deleteByIdGeneric("ROLE", "ID", id); }
  async roleExists(id) { return !!(await this.getRoleById(id)); }

  // MEMBER: { ID, NOME }
  async addMember(data) { return this._genericInsert("MEMBER", data, ['ID']); }
  async getMemberById(id) { return this._getByIdGeneric("MEMBER", "ID", id); }
  async getAllMembers() { return this._getAllGeneric("MEMBER"); }
  async updateMember(id, fields) { return this._updateByIdGeneric("MEMBER", "ID", id, fields); }
  async deleteMember(id) { return this._deleteByIdGeneric("MEMBER", "ID", id); }
  async memberExists(id) { return !!(await this.getMemberById(id)); }

  // GUILD_MEMBER: { GUILD_ID, MEMBER_ID }
  async addGuildMember(data) { return this._genericInsert("GUILD_MEMBER", data, ['GUILD_ID', 'MEMBER_ID']);}
  async removeMemberFromGuild(guildId, memberId) { const [r] = await this._executeQuery("DELETE FROM `GUILD_MEMBER` WHERE `GUILD_ID` = ? AND `MEMBER_ID` = ?", [guildId, memberId]); return r;}
  async getMembersOfGuild(guildId) { return this._getAllRows(`SELECT m.* FROM \`MEMBER\` m JOIN \`GUILD_MEMBER\` gm ON m.ID = gm.MEMBER_ID WHERE gm.GUILD_ID = ?`, [guildId]); }
  async getGuildsOfMember(memberId) { return this._getAllRows(`SELECT g.* FROM \`GUILD\` g JOIN \`GUILD_MEMBER\` gm ON g.ID = gm.GUILD_ID WHERE gm.MEMBER_ID = ?`, [memberId]); }
  async isMemberInGuild(guildId, memberId) { return !!(await this._getOne("SELECT 1 FROM `GUILD_MEMBER` WHERE `GUILD_ID` = ? AND `MEMBER_ID` = ? LIMIT 1", [guildId, memberId])); }

  // MEMBER_ROLE: { MEMBER_ID, ROLE_ID }
  async addMemberRole(data) { return this._genericInsert("MEMBER_ROLE", data, ['MEMBER_ID', 'ROLE_ID']); }
  async getMemberRole(memberId, roleId) { return this._getOne("SELECT * FROM `MEMBER_ROLE` WHERE `MEMBER_ID` = ? AND `ROLE_ID` = ?", [memberId, roleId]); }
  async getAllMemberRoles() { return this._getAllGeneric("MEMBER_ROLE"); }
  async deleteMemberRole(memberId, roleId) { const [r] = await this._executeQuery("DELETE FROM `MEMBER_ROLE` WHERE `MEMBER_ID` = ? AND `ROLE_ID` = ?", [memberId, roleId]); return r;}
  async getRolesOfMember(memberId) { return this._getAllRows(`SELECT r.* FROM \`ROLE\` r JOIN \`MEMBER_ROLE\` mr ON r.ID = mr.ROLE_ID WHERE mr.MEMBER_ID = ?`, [memberId]); }
  async getMembersWithRole(roleId) { return this._getAllRows(`SELECT m.* FROM \`MEMBER\` m JOIN \`MEMBER_ROLE\` mr ON m.ID = mr.MEMBER_ID WHERE mr.ROLE_ID = ?`, [roleId]); }

  // LOG: { ID, TYPE, DESCRIZIONE?, ID_GUILD }
  async addLog(data) { return this._genericInsert("LOG", data, ['ID']); }
  async getLogById(id) { return this._getByIdGeneric("LOG", "ID", id); }
  async getAllLogs() { return this._getAllGeneric("LOG"); } // Attenzione: può essere grande
  async getLogsByGuild(guildId, { limit = 50, offset = 0, orderBy = 'ID', orderDirection = 'DESC' } = {}) {
    const validCols = ['ID', 'TYPE']; const safeOB = validCols.includes(orderBy.toUpperCase())?orderBy:'ID'; const safeOD = orderDirection.toUpperCase()==='ASC'?'ASC':'DESC';
    return this._getAllRows(`SELECT * FROM \`LOG\` WHERE \`ID_GUILD\` = ? ORDER BY \`${safeOB}\` ${safeOD} LIMIT ? OFFSET ?`, [guildId, limit, offset]);
  }
  async updateLog(id, fields) { return this._updateByIdGeneric("LOG", "ID", id, fields); }
  async deleteLog(id) { return this._deleteByIdGeneric("LOG", "ID", id); }

  // Transaction helpers
  async beginTransaction() { try {const c = await this.getConnection(); await c.beginTransaction(); BotConsole.info(`TXN Begin (Conn ${c.threadId})`); return c;} catch(e){BotConsole.error("TXN Begin Err",e);throw e;}}
  async commit(c) { if(!c) {BotConsole.error("Commit chiamato senza connessione valida"); throw new Error("Connessione non valida per commit");} try {await c.commit(); BotConsole.success(`TXN Commit (Conn ${c.threadId})`);} catch(e){BotConsole.error(`TXN Commit Err (Conn ${c.threadId})`,e);throw e;} finally {if(c && c.release) c.release(); /*BotConsole.info(`Conn ${c.threadId} released after commit attempt`);*/}}
  async rollback(c) { if(!c) {BotConsole.error("Rollback chiamato senza connessione valida"); throw new Error("Connessione non valida per rollback");} try {await c.rollback(); BotConsole.warning(`TXN Rollback (Conn ${c.threadId})`);} catch(e){BotConsole.error(`TXN Rollback Err (Conn ${c.threadId})`,e);} finally {if(c && c.release) c.release(); /*BotConsole.info(`Conn ${c.threadId} released after rollback attempt`);*/}}

  async closePool() {
    if (this.pool) {
      try {
        await this.pool.end();
        BotConsole.success("Pool di connessioni MySQL chiusa con successo.");
        this.pool = null;
      } catch (err) {
        BotConsole.error("Errore durante la chiusura della pool MySQL:", err);
      }
    } else {
      BotConsole.warning("Tentativo di chiudere una pool MySQL non inizializzata o già chiusa.");
    }
  }
}

export default new SqlManager();