import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/services/SqlManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import welcomeImageService from "../../../class/services/WelcomeImageService.js";
import { Events, PermissionsBitField, time } from "discord.js";

export default {
  name: "NewMemberManager",
  eventType: Events.GuildMemberAdd,
  isActive: true,

  async execute(member) {
    const { guild, user } = member;
    const logPrefix = `[MemberAdd - ${guild.name}][${user.tag}]`;
    BotConsole.info(`${logPrefix} Si è unito al server.`);

    try {
      const memberName = member.user.tag;

      const globalSyncResult = await SqlManager.synchronizeGlobalMember({
        id: member.id,
        globalName: memberName,
      });

      const isRejoiningMember = globalSyncResult.operation !== "inserted";

      if (isRejoiningMember) {
        BotConsole.info(`${logPrefix} Rilevato come membro che rientra.`);
      }

      await SqlManager.ensureGuildMemberAssociation(guild.id, member.id);
      BotConsole.debug(
        `${logPrefix} Sincronizzazione DB utente/gilda completata.`
      );

      const rolesWereRestored = await this.handleRoleAssignment(
        member,
        logPrefix,
        isRejoiningMember
      );
      await this.sendWelcomeMessage(
        member,
        rolesWereRestored || isRejoiningMember,
        logPrefix
      );
    } catch (error) {
      BotConsole.error(
        `${logPrefix} Errore generale nell'evento guildMemberAdd.`,
        error
      );
    }
  },

  async handleRoleAssignment(member, logPrefix, isRejoiningMember) {
    if (member.user.bot) {
      await this.assignDefaultRole(member, "bot", logPrefix);
      return false;
    }

    const restoredRoles = await this.restorePreviousRoles(member, logPrefix);

    if (restoredRoles.length > 0) {
      const roleNames = restoredRoles.map((r) => `\`${r.name}\``).join(", ");
      const dmEmbed = new PresetEmbed({ guild: member.guild });
      await dmEmbed.init();
      dmEmbed
        .setTitle("🎭 Ruoli Ripristinati")
        .setDescription(
          `Bentornato/a su **${member.guild.name}**! I tuoi ruoli precedenti sono stati ripristinati:\n${roleNames}`
        )
        .setThumbnail(member.guild.iconURL({ dynamic: true, size: 256 }))
        .setFooter({
          text: `ID Utente: ${member.id}`,
        });
      await member.send({ embeds: [dmEmbed] }).catch(() => {});
      return true;
    }

    // Assegna il ruolo di default solo se è un membro veramente nuovo
    // (non uno di ritorno che magari non aveva ruoli).
    if (!isRejoiningMember) {
      await this.assignDefaultRole(member, "user", logPrefix);
    }

    return false;
  },

  async restorePreviousRoles(member, logPrefix) {
    const dbRoles = await SqlManager.getRolesOfMember(member.id);
    const rolesInThisGuild = dbRoles.filter(
      (r) => r.IDGUILD === member.guild.id
    );
    if (rolesInThisGuild.length === 0) return [];
    const rolesToRestore = rolesInThisGuild
      .map((dbRole) => member.guild.roles.cache.get(dbRole.ID))
      .filter(Boolean);
    const restoredRoles = [];
    for (const role of rolesToRestore) {
      if (this.canBotManageRole(member.guild, role, logPrefix)) {
        try {
          await member.roles.add(role, "Ripristino ruoli precedenti.");
          restoredRoles.push(role);
        } catch (e) {
          /* L'errore viene già loggato altrove */
        }
      }
    }
    if (restoredRoles.length > 0)
      BotConsole.success(
        `${logPrefix} Ripristinati ${restoredRoles.length} ruoli.`
      );
    return restoredRoles;
  },

  async assignDefaultRole(member, type, logPrefix) {
    const guildConfig = await SqlManager.getGuildById(member.guild.id);
    const roleId =
      type === "user"
        ? guildConfig?.ROLEDEFAULT_ID
        : guildConfig?.ROLEBOTDEFAULT_ID;
    if (!roleId) return;
    const role = member.guild.roles.cache.get(roleId);
    if (!role) return;
    if (this.canBotManageRole(member.guild, role, logPrefix)) {
      try {
        await member.roles.add(role, `Ruolo di default per ${type}.`);
        BotConsole.success(
          `${logPrefix} Assegnato ruolo di default: "${role.name}".`
        );
      } catch (e) {
        /* L'errore viene già loggato altrove */
      }
    }
  },

  canBotManageRole(guild, role, logPrefix) {
    const botMember = guild.members.me;
    if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      BotConsole.warning(
        `${logPrefix} Il bot non ha il permesso 'Gestire Ruoli'.`
      );
      return false;
    }
    if (botMember.roles.highest.comparePositionTo(role) <= 0) {
      BotConsole.warning(
        `${logPrefix} Il bot non può gestire il ruolo "${role.name}" a causa della gerarchia.`
      );
      return false;
    }
    return true;
  },

  async sendWelcomeMessage(member, isReturningMember, logPrefix) {
    const { guild, user } = member;
    const guildConfig = await SqlManager.getGuildById(guild.id);

    const channel = await this._getWelcomeChannel(
      guild,
      guildConfig,
      logPrefix
    );
    if (!channel) return;

    const welcomeEmbed = new PresetEmbed({ guild });
    await welcomeEmbed.init(false);

    const welcomeTitle = isReturningMember
      ? `🎉 Bentornato/a, ${member.displayName}!`
      : `🎉 Benvenuto/a, ${member.displayName}!`;

    let description = `🎊 ${member} si è unito/a a **${guild.name}**!\nOra siamo in **${guild.memberCount}** membri!`;

    if (guildConfig?.RULES_CH_ID) {
      description += `\n\nTi invitiamo a leggere il nostro <#${guildConfig.RULES_CH_ID}> per una buona permanenza!`;
    }

    const accountCreationDate = time(user.createdAt, "R");

    welcomeEmbed
      .setTitle(welcomeTitle)
      .setDescription(description)
      .addFields(
        { name: "📅 Account Creato", value: accountCreationDate, inline: true },
        { name: "🆔 ID Utente", value: user.id, inline: true },
        {
          name: "👥 Membri Totali",
          value: `${guild.memberCount}`,
          inline: true,
        }
      )
      .setColor("#00ADEF");

    await welcomeImageService.init();

    const imageResult = welcomeImageService
      ? await welcomeImageService.generate(member, guild)
      : null;

    const messagePayload = { embeds: [welcomeEmbed] };

    if (imageResult?.attachment) {
      welcomeEmbed
        .setImageUrl(`attachment://${imageResult.attachment.name}`)
        .setColor(imageResult.embedColorHex);
      messagePayload.files = [imageResult.attachment];
    } else {
      if (welcomeImageService)
        BotConsole.warning(
          `${logPrefix} Generazione immagine fallita, invio embed di fallback sofisticato.`
        );

      welcomeEmbed.setThumbnail(
        user.displayAvatarURL({ dynamic: true, size: 256 })
      );
    }

    await channel.send(messagePayload);
    BotConsole.success(`${logPrefix} Messaggio di benvenuto inviato.`);
  },

  async _getWelcomeChannel(guild, guildConfig, logPrefix) {
    if (!guildConfig?.WELCOME_ID) {
      BotConsole.info(`${logPrefix} Canale di benvenuto non configurato.`);
      return null;
    }
    const channel = await guild.channels
      .fetch(guildConfig.WELCOME_ID)
      .catch(() => null);
    const requiredPerms = [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks,
      PermissionsBitField.Flags.AttachFiles,
    ];
    if (
      !channel?.isTextBased() ||
      !channel.permissionsFor(guild.members.me).has(requiredPerms)
    ) {
      BotConsole.warning(
        `${logPrefix} Canale di benvenuto (${guildConfig.WELCOME_ID}) non trovato o permessi mancanti.`
      );
      return null;
    }
    return channel;
  },
};
