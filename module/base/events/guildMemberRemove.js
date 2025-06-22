import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/Sql/SqlManager.js";
import { Events } from "discord.js";

export default {
  name: "MemberLeaveManager",
  eventType: Events.GuildMemberRemove,
  isActive: true,

  async execute(member) {
    const { guild, user, client } = member;
    const logPrefix = `[MemberLeave - ${guild.name}][${user.tag}]`;
    BotConsole.info(`${logPrefix} Ha lasciato il server.`);

    try {
      const hadImportantRoles = !member.partial && member.roles.cache.size > 1;

      if (hadImportantRoles) {
        BotConsole.info(
          `${logPrefix} L'utente aveva ruoli, sincronizzo lo stato finale prima di rimuoverlo.`
        );
        const syncManager = client.syncManager;
        if (syncManager) {
          await syncManager.synchronizeGuildMember(member);
        }
      } else {
        BotConsole.info(
          `${logPrefix} L'utente non aveva ruoli specifici, non c'è cronologia da salvare.`
        );

        const result = await SqlManager.removeMemberFromGuild(
          guild.id,
          member.id
        );

        if (result.affectedRows > 0) {
          BotConsole.success(
            `${logPrefix} Associazione gilda-membro rimossa correttamente.`
          );
        } else {
          BotConsole.warning(
            `${logPrefix} Associazione gilda-membro non trovata (potrebbe essere già stata rimossa).`
          );
        }
      }
    } catch (error) {
      BotConsole.error(
        `${logPrefix} Errore durante l'evento guildMemberRemove.`,
        error
      );
    }
  },
};
