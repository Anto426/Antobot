import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/services/SqlManager.js";
import { Events } from "discord.js";

export default {
  name: "MemberLeaveManager",
  eventType: Events.GuildMemberRemove,
  isActive: true,

  async execute(member) {
    if (member.partial) {
      try {
        await member.fetch();
      } catch (error) {
        BotConsole.error(
          `[MemberLeave] Impossibile recuperare membro parziale ${member.id}.`,
          error
        );
        return; // Interrompe se non si possono ottenere dati completi
      }
    }

    const { guild, user } = member;
    const logPrefix = `[MemberLeave - ${guild.name}][${user.tag}]`;
    BotConsole.info(`${logPrefix} Ha lasciato il server.`);

    try {
      await this.synchronizeFinalRoles(member, logPrefix);
      await this.removeGuildAssociation(guild.id, member.id, logPrefix);
    } catch (error) {
      BotConsole.error(
        `${logPrefix} Errore durante l'evento guildMemberRemove.`,
        error
      );
    }
  },

  async synchronizeFinalRoles(member, logPrefix) {
    const rolesToSave = new Set(
      member.roles.cache
        .filter((r) => r.id !== member.guild.id)
        .map((r) => r.id)
    );

    BotConsole.info(
      `${logPrefix} Sincronizzazione finale di ${rolesToSave.size} ruoli...`
    );
    await SqlManager.synchronizeMemberRolesForGuild(
      member.id,
      member.guild.id,
      rolesToSave
    );
    BotConsole.success(`${logPrefix} Stato finale dei ruoli memorizzato.`);
  },

  async removeGuildAssociation(guildId, memberId, logPrefix) {
    const result = await SqlManager.removeMemberFromGuild(guildId, memberId);
    if (result.affectedRows > 0) {
      BotConsole.success(
        `${logPrefix} Associazione gilda-membro rimossa correttamente.`
      );
    } else {
      BotConsole.warning(
        `${logPrefix} Associazione gilda-membro non trovata (potrebbe essere già stata rimossa).`
      );
    }
  },
};
