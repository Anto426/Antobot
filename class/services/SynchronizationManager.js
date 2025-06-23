import BotConsole from "../console/BotConsole.js";
import SqlManager from "../services/SqlManager.js";
import ConfigManager from "../services/ConfigManager.js";

class SynchronizationManager {
  async synchronizeAll() {
    const startTime = Date.now();

    try {
      await this.#ensureDbConnection();
      await this.pruneObsoleteGuilds();

      const guilds = Array.from(client.guilds.cache.values());
      for (const [index, guild] of guilds.entries()) {
        const guildLogPrefix = `[Sync ${index + 1}/${guilds.length}][${
          guild.name
        }]`;
        try {
          await this.synchronizeGuild(guild, guildLogPrefix);
        } catch (guildError) {
          BotConsole.error(
            `${guildLogPrefix} Errore non gestito durante la sincronizzazione.`,
            guildError
          );
        }
      }
    } catch (error) {
      BotConsole.error("[Sync Globale] Errore critico.", error);
    } finally {
      const endTime = Date.now();
      BotConsole.success(
        `SINCRONIZZAZIONE GLOBALE TERMINATA IN ${
          (endTime - startTime) / 1000
        }s.`
      );
    }
  }

  async synchronizeGuild(guildOrId, logPrefix = "") {
    const guild = await this.#resolveGuild(guildOrId);
    if (!guild) return;

    const guildLogPrefix = logPrefix || `[Sync Guild][${guild.name}]`;
    BotConsole.info(`${guildLogPrefix} Inizio sincronizzazione completa.`);

    await SqlManager.synchronizeGuild({ id: guild.id, name: guild.name });
    await this.#synchronizeRolesForGuild(guild, guildLogPrefix);
    await this.#synchronizeMembersForGuild(guild, guildLogPrefix);

    BotConsole.success(
      `${guildLogPrefix} Sincronizzazione completa terminata.`
    );
  }

  async pruneObsoleteGuilds() {
    BotConsole.info("[Prune] Ricerca gilde obsolete nel database...");
    const allClientGuildIds = new Set(client.guilds.cache.map((g) => g.id));
    const dbGuilds = await SqlManager.getAllGuilds();

    for (const dbGuild of dbGuilds) {
      if (!allClientGuildIds.has(dbGuild.ID)) {
        BotConsole.warning(
          `[Prune] Gilda "${dbGuild.NOME}" (${dbGuild.ID}) non più accessibile. Rimozione dati...`
        );
        // Grazie a ON DELETE CASCADE, questa chiamata è sufficiente
        await SqlManager.deleteGuild(dbGuild.ID);
      }
    }
    BotConsole.info("[Prune] Pulizia gilde obsolete completata.");
  }

  async #synchronizeRolesForGuild(guild, logPrefix) {
    BotConsole.info(`${logPrefix} Sincronizzazione Ruoli...`);
    const clientRoleIds = new Set(
      guild.roles.cache.filter((r) => r.id !== guild.id).map((r) => r.id)
    );
    const dbRoles = await SqlManager.getRolesByGuild(guild.id);

    for (const dbRole of dbRoles) {
      if (!clientRoleIds.has(dbRole.ID)) {
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
    BotConsole.info(`${logPrefix} Sincronizzazione Ruoli COMPLETATA.`);
  }

  async #synchronizeMembersForGuild(guild, logPrefix) {
    BotConsole.info(`${logPrefix} Sincronizzazione Membri...`);
    let fetchedMembers;
    try {
      fetchedMembers = await guild.members.fetch();
    } catch (fetchError) {
      BotConsole.error(`${logPrefix} Errore recupero membri.`, fetchError);
      return;
    }

    const clientMemberIds = new Set(fetchedMembers.map((m) => m.id));
    const dbMembersInGuild = await SqlManager.getMembersOfGuild(guild.id);

    for (const dbMember of dbMembersInGuild) {
      if (!clientMemberIds.has(dbMember.ID)) {
        await SqlManager.removeMemberFromGuild(guild.id, dbMember.ID);
      }
    }

    for (const member of fetchedMembers.values()) {
      if (member.user.bot && member.user.id !== client.user.id) continue;

      const memberLogName =
        member.user.globalName ||
        member.user.displayName ||
        member.user.username;
      await SqlManager.synchronizeGlobalMember({
        id: member.id,
        globalName: memberLogName,
      });
      await SqlManager.ensureGuildMemberAssociation(guild.id, member.id);

      const roleIdsSet = new Set(
        member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r.id)
      );
      await SqlManager.synchronizeMemberRolesForGuild(
        member.id,
        guild.id,
        roleIdsSet
      );
    }
    BotConsole.info(
      `${logPrefix} Sincronizzazione Membri (${fetchedMembers.size}) COMPLETATA.`
    );
  }

  async #resolveGuild(guildOrId) {
    if (typeof guildOrId === "string") {
      try {
        return await client.guilds.fetch(guildOrId);
      } catch {
        BotConsole.error(`Impossibile trovare la gilda con ID: ${guildOrId}`);
        return null;
      }
    }
    return guildOrId;
  }

  async synchronizeGuildMember(member) {
    if (!member) return;

    const { guild, user } = member;
    const logPrefix = `[ManualSync - ${guild.name}][${user.tag}]`;
    BotConsole.info(`${logPrefix} Avvio sincronizzazione manuale ruoli...`);

    try {
      const roleIdsSet = new Set(
        member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r.id)
      );
      await SqlManager.synchronizeMemberRolesForGuild(
        member.id,
        guild.id,
        roleIdsSet
      );
      BotConsole.success(`${logPrefix} Sincronizzazione ruoli completata.`);
      return true;
    } catch (error) {
      BotConsole.error(
        `${logPrefix} Errore durante la sincronizzazione manuale.`,
        error
      );
      return false;
    }
  }

  async #ensureDbConnection() {
    if (SqlManager.pool) return;
    const sqlConfig = ConfigManager.getConfig("sql");
    if (!sqlConfig) throw new Error("Configurazione SQL mancante.");
    await SqlManager.connect(sqlConfig);
  }
}

export default new SynchronizationManager();
