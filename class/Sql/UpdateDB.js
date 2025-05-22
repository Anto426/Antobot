import ConfigManager from "../ConfigManager/ConfigManager.js";
import BotConsole from "../console/BotConsole.js";
import SqlManager from "./SqlManager.js";

class DataUpdater {
  constructor() {
    BotConsole.info("Istanza di DataUpdater creata.");
  }

  async _ensureDbConnection() {
    if (!SqlManager.pool) {
      BotConsole.info(
        "[DataUpdater] SqlManager.pool non trovato, tentativo di connessione..."
      );
      const sqlConfig = ConfigManager.getConfig("sql");
      if (!sqlConfig) {
        BotConsole.error("[DataUpdater] Configurazione SQL non trovata.");
        throw new Error("Configurazione SQL mancante per DataUpdater.");
      }
      await SqlManager.connect(sqlConfig);
    } else {
      BotConsole.info(
        "[DataUpdater] SqlManager già connesso, utilizzo della pool esistente."
      );
    }
  }

  async updateAll() {
    if (!client || !client.guilds) {
      BotConsole.error(
        "Client Discord non valido o guilds non accessibili in DataUpdater.updateAll."
      );
      throw new Error("Client Discord non valido o non pronto.");
    }

    const startTime = Date.now();
    BotConsole.info(
      `[DataUpdater] INIZIO PROCESSO DI AGGIORNAMENTO COMPLETO DATI - ${new Date().toISOString()}`
    );

    try {
      await this._ensureDbConnection();

      const allClientGuildIds = new Set(client.guilds.cache.map((g) => g.id));

      BotConsole.info("[DataUpdater - FASE 1] Pulizia Gilde obsolete...");
      const dbGuilds = await SqlManager.getAllGuilds();
      for (const dbGuild of dbGuilds) {
        if (!allClientGuildIds.has(dbGuild.ID)) {
          BotConsole.warning(
            `[DataUpdater] Gilda ${dbGuild.NOME} (${dbGuild.ID}) presente nel DB ma non nel client. Rimozione...`
          );
          await SqlManager.deleteGuild(dbGuild.ID); // Cascade dovrebbe gestire le dipendenze
        }
      }
      BotConsole.info(
        "[DataUpdater - FASE 1] Pulizia Gilde obsolete COMPLETATA."
      );

      let guildCounter = 0;
      const totalGuilds = client.guilds.cache.size;

      for (const guild of client.guilds.cache.values()) {
        guildCounter++;
        const guildLogPrefix = `[DataUpdater - Gilda ${guildCounter}/${totalGuilds}: ${guild.name} (${guild.id})]`;
        BotConsole.info(`Inizio sincronizzazione`);

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

        BotConsole.info(
          `${guildLogPrefix} Sincronizzazione Membri e Relazioni...`
        );
        let fetchedMembers;
        try {
          fetchedMembers = await guild.members.fetch();
        } catch (fetchError) {
          BotConsole.error(
            `${guildLogPrefix} Errore recupero membri. Salto membri per questa gilda.`,
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
              `${guildLogPrefix} Membro ${dbMember.NOME} (${dbMember.ID}) non più in gilda (client). Rimozione GUILD_MEMBER...`
            );
            await SqlManager.removeMemberFromGuild(guild.id, dbMember.ID);
          }
        }

        let memberCounter = 0;
        const totalMembersInGuild = fetchedMembers.size;
        for (const member of fetchedMembers.values()) {
          if (member.user.bot && member.user.id !== client.user.id) {
            BotConsole.debug(
              `${guildLogPrefix} Saltato membro bot: ${member.user.tag} (${member.id})`
            );
            continue;
          }
          memberCounter++;
          const memberLogPrefix = `${guildLogPrefix} [Membro ${memberCounter}/${totalMembersInGuild}: ${member.user.tag} (${member.id})]`;

          const memberGlobalName =
            member.user.globalName ||
            member.user.displayName ||
            member.user.username;
          BotConsole.debug(
            `${memberLogPrefix} Elaborazione (Nome: "${memberGlobalName}")...`
          );

          await SqlManager.synchronizeGlobalMember({
            id: member.id,
            globalName: memberGlobalName,
          });
          await SqlManager.ensureGuildMemberAssociation(guild.id, member.id);

          const discordMemberRoleIdsSet = new Set(
            member.roles.cache
              .filter((role) => role.id !== guild.id)
              .map((role) => role.id)
          );
          await SqlManager.synchronizeMemberRolesForGuild(
            member.id,
            guild.id,
            discordMemberRoleIdsSet
          );
        }
        BotConsole.info(
          `${guildLogPrefix} Sincronizzazione Membri e Relazioni (${fetchedMembers.size} membri) COMPLETATA.`
        );
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      BotConsole.success(
        `[DataUpdater] PROCESSO DI AGGIORNAMENTO COMPLETO DATI TERMINATO IN ${duration.toFixed(
          2
        )} secondi.`
      );
    } catch (error) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      BotConsole.error(
        `[DataUpdater] ERRORE CRITICO NON GESTITO durante l'aggiornamento (dopo ${duration.toFixed(
          2
        )}s):`
      );
      console.error(error); // Stampa l'errore completo con stack trace
    } finally {
      BotConsole.info(
        "[DataUpdater] Processo DataUpdater.updateAll formalmente terminato."
      );
    }
  }
}

export default new DataUpdater();
