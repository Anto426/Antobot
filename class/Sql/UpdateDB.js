import ConfigManager from "../ConfigManager/ConfigManager.js";
import BotConsole from "../console/BotConsole.js";
import SqlManager from "./SqlManager.js";

class UpdateDB {
  async _ensureDbConnection() {
    if (!SqlManager.pool) {
      BotConsole.info(
        "[DataUpdater] SqlManager.pool non trovato, tentativo di connessione..."
      );
      const sqlConfig = ConfigManager.getConfig("sql");
      if (!sqlConfig)
        throw new Error("Configurazione SQL mancante per DataUpdater.");
      await SqlManager.connect(sqlConfig);
    } else {
      BotConsole.info("[DataUpdater] SqlManager già connesso.");
    }
  }

  async updateAll() {
    if (!client || !client.guilds)
      throw new Error("Client Discord non valido o guilds non accessibili.");
    const startTime = Date.now();
    BotConsole.info(
      `[DataUpdater] INIZIO SYNC DATI - ${new Date().toISOString()}`
    );
    try {
      await this._ensureDbConnection();
      const allClientGuildIds = new Set(client.guilds.cache.map((g) => g.id));

      BotConsole.info("[DataUpdater - FASE 1] Pulizia Gilde obsolete...");
      const dbGuilds = await SqlManager.getAllGuilds();
      for (const dbGuild of dbGuilds) {
        if (!allClientGuildIds.has(dbGuild.ID)) {
          BotConsole.warning(
            `[DataUpdater] Gilda ${dbGuild.NOME} (${dbGuild.ID}) (DB) non nel client. Rimozione...`
          );
          await SqlManager.deleteGuild(dbGuild.ID);
        }
      }
      BotConsole.info("[DataUpdater - FASE 1] Pulizia Gilde COMPLETATA.");

      let guildCounter = 0;
      const totalGuilds = client.guilds.cache.size;
      for (const guild of client.guilds.cache.values()) {
        guildCounter++;
        const guildLogPrefix = `[DataUpdater][Gilda ${guildCounter}/${totalGuilds}: ${guild.name} (${guild.id})]`;
        BotConsole.info(`${guildLogPrefix} Inizio sincronizzazione`);

        await SqlManager.synchronizeGuild({ id: guild.id, name: guild.name });

        BotConsole.info(`${guildLogPrefix} Sincronizzazione Ruoli...`);
        const clientGuildRoleIds = new Set(
          guild.roles.cache.filter((r) => r.id !== guild.id).map((r) => r.id)
        );
        const dbRolesInThisGuild = await SqlManager.getRolesByGuild(guild.id);
        for (const dbRole of dbRolesInThisGuild) {
          if (!clientGuildRoleIds.has(dbRole.ID)) {
            BotConsole.warning(
              `${guildLogPrefix} Ruolo ${dbRole.NOME} (${dbRole.ID}) (DB) non più nel client. Rimozione...`
            );
            await SqlManager.deleteRole(dbRole.ID);
          }
        }
        for (const role of guild.roles.cache.values()) {
          if (role.id === guild.id) continue;
          await SqlManager.synchronizeRole({
            id: role.id,
            name: role.name,
            color: role.color,
            guildId: guild.id,
          });
        }
        BotConsole.info(`${guildLogPrefix} Sincronizzazione Ruoli COMPLETATA.`);

        BotConsole.info(`${guildLogPrefix} Sincronizzazione Membri...`);
        let fetchedMembers;
        try {
          fetchedMembers = await guild.members.fetch();
        } catch (fetchError) {
          BotConsole.error(
            `${guildLogPrefix} Errore recupero membri. Salto.`,
            fetchError
          );
          continue;
        }

        const clientMemberIdsInGuild = new Set(fetchedMembers.map((m) => m.id));
        const dbGuildMemberObjects = await SqlManager.getMembersOfGuild(
          guild.id
        );
        for (const dbMember of dbGuildMemberObjects) {
          if (!clientMemberIdsInGuild.has(dbMember.ID)) {
            BotConsole.warning(
              `${guildLogPrefix} Membro ${dbMember.NOME} (${dbMember.ID}) non più in gilda. Rimozione GUILD_MEMBER...`
            );
            await SqlManager.removeMemberFromGuild(guild.id, dbMember.ID);
          }
        }

        let memberCounter = 0;
        const totalMembersInGuild = fetchedMembers.size;
        for (const member of fetchedMembers.values()) {
          if (member.user.bot && member.user.id !== client.user.id) continue;
          memberCounter++;
          const memberLogName =
            member.user.globalName ||
            member.user.displayName ||
            member.user.username;
          BotConsole.debug(
            `${guildLogPrefix} [Membro ${memberCounter}/${totalMembersInGuild}: ${member.user.tag} (${member.id})] Elaborazione...`
          );
          await SqlManager.synchronizeGlobalMember({
            id: member.id,
            globalName: memberLogName,
          });
          await SqlManager.ensureGuildMemberAssociation(guild.id, member.id);
          const discordMemberRoleIdsSet = new Set(
            member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r.id)
          );
          await SqlManager.synchronizeMemberRolesForGuild(
            member.id,
            guild.id,
            discordMemberRoleIdsSet
          );
        }
        BotConsole.info(
          `${guildLogPrefix} Sincronizzazione Membri (${fetchedMembers.size}) COMPLETATA.`
        );
      }
      const endTime = Date.now();
      BotConsole.success(
        `[DataUpdater] SYNC DATI TERMINATO IN ${(endTime - startTime) / 1000}s.`
      );
    } catch (error) {
      const endTime = Date.now();
      BotConsole.error(
        `[DataUpdater] ERRORE CRITICO NON GESTITO (dopo ${
          (endTime - startTime) / 1000
        }s):`
      );
      BotConsole.error(error);
    } finally {
      BotConsole.info("[DataUpdater] Processo updateAll terminato.");
    }
  }
}
export default new UpdateDB();
