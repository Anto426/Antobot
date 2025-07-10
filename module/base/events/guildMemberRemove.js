import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/services/SqlManager.js";
import { Events } from "discord.js";

export default {
  name: "MemberLeaveManager",
  eventType: Events.GuildMemberRemove,
  isActive: true,

  async execute(member) {
    const { guild, user } = member;
    const logPrefix = `[MemberLeave - ${guild.name}][${user.tag}]`;
    BotConsole.info(`${logPrefix} Ha lasciato il server.`);

    try {
      if (member.partial) {
        BotConsole.warning(
          `${logPrefix} Oggetto membro parziale. Non è possibile salvare la cronologia dei ruoli.`
        );
      } else {
        const rolesToSave = member.roles.cache.filter(
          (role) => role.id !== guild.id
        );

        if (rolesToSave.size > 0) {
          BotConsole.info(
            `${logPrefix} L'utente aveva ${rolesToSave.size} ruoli specifici. Salvataggio in corso...`
          );

          for (const role of rolesToSave.values()) {
            try {
              await SqlManager.addMemberRole({
                MEMBER_ID: member.id,
                ROLE_ID: role.id,
              });
            } catch (error) {}
          }
          BotConsole.success(
            `${logPrefix} Stato finale dei ruoli memorizzato.`
          );
        } else {
          BotConsole.info(
            `${logPrefix} L'utente non aveva ruoli specifici da salvare.`
          );

          const result = [];
          result[0] = await SqlManager.removeMemberFromGuild(
            guild.id,
            member.id
          );

          result[1] = await SqlManager.removeMemberRoles(member.id);

          if (result[0].affectedRows > 0 && result[1].affectedRows > 0) {
            BotConsole.success(
              `${logPrefix} Associazione gilda-membro rimossa correttamente.`
            );
          } else {
            BotConsole.warning(
              `${logPrefix} Associazione gilda-membro non trovata (potrebbe essere già stata rimossa).`
            );
          }
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
