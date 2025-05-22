import ConfigManager from "../ConfigManager/ConfigManager.js"; // Assicurati che il percorso sia corretto
import BotConsole from "../console/BotConsole.js"; // Assicurati che il percorso sia corretto
import SqlManager from "./SqlManager.js"; // SqlManager è un'istanza singleton

class DataUpdater {
  async _ensureDbConnection() {
    if (!SqlManager.pool) {
      BotConsole.info(
        "SqlManager.pool non trovato in DataUpdater, tentativo di connessione..."
      );
      const sqlConfig = ConfigManager.getConfig("sql");
      if (!sqlConfig) {
        BotConsole.error("Configurazione SQL non trovata per DataUpdater.");
        throw new Error("Configurazione SQL mancante.");
      }
      // connect gestisce già il caso di pool esistente, quindi non c'è rischio di crearne multiple
      await SqlManager.connect(sqlConfig);
      BotConsole.success(
        "Connessione a SqlManager (ri)verificata da DataUpdater."
      );
    } else {
      BotConsole.info(
        "SqlManager già connesso (DataUpdater), utilizzo della pool esistente."
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
      "================================================================"
    );
    BotConsole.info(
      `INIZIO PROCESSO DI AGGIORNAMENTO COMPLETO DATI - ${new Date().toISOString()}`
    );
    BotConsole.info(
      "================================================================"
    );

    try {
      await this._ensureDbConnection();

      const allClientGuildIds = new Set(client.guilds.cache.map((g) => g.id));

      // 1. Pulisci Gilde non più nel client
      BotConsole.info("[FASE 1] Pulizia Gilde obsolete...");
      const dbGuilds = await SqlManager.getAllGuilds();
      for (const dbGuild of dbGuilds) {
        if (!allClientGuildIds.has(dbGuild.ID)) {
          // Confronto VARCHAR con VARCHAR
          BotConsole.warning(
            `Gilda ${dbGuild.NOME} (${dbGuild.ID}) presente nel DB ma non nel client. Rimozione...`
          );
          await SqlManager.deleteGuild(dbGuild.ID);
        }
      }
      BotConsole.info("[FASE 1] Pulizia Gilde obsolete COMPLETATA.");

      // Elaborazione per ogni gilda del client
      let guildCounter = 0;
      const totalGuilds = client.guilds.cache.size;

      for (const guild of client.guilds.cache.values()) {
        guildCounter++;
        const guildLogPrefix = `[Gilda ${guildCounter}/${totalGuilds}: ${guild.name} (${guild.id})]`;
        BotConsole.info(
          `----------------------------------------------------------------`
        );
        BotConsole.info(`${guildLogPrefix} Inizio sincronizzazione`);

        // 2. Sincronizza Gilda (solo nome, gli ID FK verranno gestiti dal comando /setguild)
        await SqlManager.synchronizeGuild({ id: guild.id, name: guild.name });

        // 3. Sincronizza Ruoli della Gilda
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
          if (role.id === guild.id) continue; // Salta @everyone
          await SqlManager.synchronizeRole({
            id: role.id, // VARCHAR
            name: role.name,
            color: role.color,
            guildId: guild.id, // VARCHAR
          });
        }
        BotConsole.info(`${guildLogPrefix} Sincronizzazione Ruoli COMPLETATA.`);

        // 4. Sincronizza Membri e Relazioni
        BotConsole.info(
          `${guildLogPrefix} Sincronizzazione Membri e Relazioni...`
        );
        let fetchedMembers;
        try {
          fetchedMembers = await guild.members.fetch(); // Recupera tutti i membri
        } catch (fetchError) {
          BotConsole.error(
            `${guildLogPrefix} Errore fatale recupero membri. Salto membri per questa gilda.`,
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
            // Confronto VARCHAR con VARCHAR
            BotConsole.warning(
              `${guildLogPrefix} Membro ${dbMember.NOME} (${dbMember.ID}) non più in gilda (client). Rimozione GUILD_MEMBER...`
            );
            await SqlManager.removeMemberFromGuild(guild.id, dbMember.ID);
          }
        }

        let memberCounter = 0;
        for (const member of fetchedMembers.values()) {
          if (member.user.bot) {
            BotConsole.debug(
              `${guildLogPrefix} Saltato membro bot: ${member.user.tag} (${member.id})`
            );
            continue;
          }
          memberCounter++;
          const memberLogPrefix = `${guildLogPrefix} [Membro ${memberCounter}/${fetchedMembers.size}: ${member.user.tag} (${member.id})]`;

          const memberGlobalName =
            member.user.globalName ||
            member.user.displayName ||
            member.user.username;
          BotConsole.debug(
            `${memberLogPrefix} Elaborazione (Nome Globale: "${memberGlobalName}")...`
          );

          await SqlManager.synchronizeGlobalMember({
            id: member.id,
            globalName: memberGlobalName,
          });
          await SqlManager.ensureGuildMemberAssociation(guild.id, member.id);

          const discordMemberRoleIdsSet = new Set(
            member.roles.cache
              .filter((role) => role.id !== guild.id)
              .map((role) => role.id) // Tutti VARCHAR
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
        BotConsole.info(
          `----------------------------------------------------------------`
        );
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      BotConsole.success(
        `PROCESSO DI AGGIORNAMENTO COMPLETO DATI TERMINATO IN ${duration.toFixed(
          2
        )} secondi.`
      );
    } catch (error) {
      // Questo è il catch principale di updateAll
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      BotConsole.error(
        `ERRORE CRITICO NON GESTITO durante l'aggiornamento completo dei dati (dopo ${duration.toFixed(
          2
        )}s):`
      );
      console.error(error); // Stampa l'errore completo, inclusa la traccia dello stack
    } finally {
      BotConsole.info(
        "Processo DataUpdater.updateAll formalmente terminato (con o senza errori)."
      );
    }
  }
}

export default new DataUpdater();
