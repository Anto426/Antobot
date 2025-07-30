import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../../class/services/SqlManager.js";
import BotConsole from "../../../../class/console/BotConsole.js";
import ConfigManager from "../../../../class/services/ConfigManager.js";
import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionsBitField,
} from "discord.js";

const STATUS_THUMBNAILS = {
  SUCCESS: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
  WARNING: "https://cdn-icons-png.flaticon.com/512/595/595067.png",
  ERROR: "https://cdn-icons-png.flaticon.com/512/463/463612.png",
  INFO: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
};

/**
 * Gestisce la creazione/eliminazione dei canali temporanei.
 * @returns {Promise<{summary: string|null, taken: boolean}>}
 */
async function handleTempChannels(interaction, guild, guildId) {
  const manageFlag = interaction.options.getBoolean("manage_temp_channels");
  if (manageFlag === null) return { summary: null, taken: false };

  const cfg = await SqlManager.getTempChannelByGuildId(guildId);
  if (manageFlag) {
    if (cfg)
      return { summary: "ℹ️ Canali Temporanei già attivi.", taken: false };

    const reason = `Setup /setguild da ${interaction.user.tag}`;
    const category = await guild.channels.create({
      name: "🔊 VOCALI TEMPORANEI 🔊",
      type: ChannelType.GuildCategory,
      reason,
    });
    const duo = await guild.channels.create({
      name: "➕ Crea Duo",
      type: ChannelType.GuildVoice,
      parent: category.id,
      reason,
    });
    const trio = await guild.channels.create({
      name: "➕ Crea Trio",
      type: ChannelType.GuildVoice,
      parent: category.id,
      reason,
    });
    const quartet = await guild.channels.create({
      name: "➕ Crea Quartetto",
      type: ChannelType.GuildVoice,
      parent: category.id,
      reason,
    });
    const nolimit = await guild.channels.create({
      name: "➕ Crea Libera",
      type: ChannelType.GuildVoice,
      parent: category.id,
      reason,
    });

    await SqlManager.addTempChannel({
      GUILD_ID: guildId,
      CATEGORY_CH: category.id,
      DUO_CH: duo.id,
      TRIO_CH: trio.id,
      QUARTET_CH: quartet.id,
      NOLIMIT_CH: nolimit.id,
    });
    return { summary: "✅ Canali Temporanei CREATI.", taken: true };
  } else {
    if (!cfg)
      return {
        summary: "ℹ️ Canali Temporanei già disabilitati.",
        taken: false,
      };

    const ids = [
      cfg.DUO_CH,
      cfg.TRIO_CH,
      cfg.QUARTET_CH,
      cfg.NOLIMIT_CH,
      cfg.CATEGORY_CH,
    ].filter(Boolean);
    for (const id of ids) {
      try {
        (await guild.channels.fetch(id).catch(() => null))?.delete();
      } catch (e) {
        BotConsole.warning(`Del TempCh ${id} err: ${e.message}`);
      }
    }
    await SqlManager.deleteTempChannel(guildId);
    return { summary: "🗑️ Canali Temporanei DISABILITATI.", taken: true };
  }
}

/**
 * Gestisce la creazione/eliminazione dei canali per le festività.
 * @returns {Promise<{summary: string|null, taken: boolean}>}
 */
async function handleHolidayChannels(interaction, guild, guildId) {
  const manageFlag = interaction.options.getBoolean("manage_hollyday_channels");
  if (manageFlag === null) return { summary: null, taken: false };

  const cfg = await SqlManager.getHollydayByGuildId(guildId);
  const reason = `Setup /setguild Eventi da ${interaction.user.tag}`;
  const lockedPerms = [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.Connect] },
  ];

  if (manageFlag) {
    if (cfg) return { summary: "ℹ️ Canali Eventi già attivi.", taken: false };

    const category = await guild.channels.create({
      name: "🎉 Eventi Speciali 🎉",
      type: ChannelType.GuildCategory,
      reason,
    });
    const textChannel = await guild.channels.create({
      name: "📢 annunci-evento",
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: lockedPerms,
      reason,
    });
    const voiceChannel = await guild.channels.create({
      name: "🥳 sala-evento",
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: lockedPerms,
      reason,
    });

    await SqlManager.addHollyday({
      GUILD_ID: guildId,
      CATEGORY_CH: category.id,
      NAME_CHANNEL: textChannel.id,
      HOLYDAY_CHANNEL: voiceChannel.id,
    });
    return {
      summary: "✅ Canali Eventi CREATI (vocale bloccato).",
      taken: true,
    };
  } else {
    if (!cfg)
      return { summary: "ℹ️ Canali Eventi già disabilitati.", taken: false };

    const ids = [cfg.NAME_CHANNEL, cfg.HOLYDAY_CHANNEL, cfg.CATEGORY_CH].filter(
      Boolean
    );
    for (const id of ids) {
      try {
        (await guild.channels.fetch(id).catch(() => null))?.delete();
      } catch (e) {
        BotConsole.warning(`Del HollyCh ${id} err: ${e.message}`);
      }
    }
    await SqlManager.deleteHollyday(guildId);
    return { summary: "🗑️ Canali Eventi DISABILITATI.", taken: true };
  }
}

export default {
  name: "setguild",
  permissions: [PermissionsBitField.Flags.Administrator],
  isActive: true,
  isBotAllowed: false,
  isOwnerOnly: false,
  data: {
    name: "setguild",
    description: "Configura o aggiorna le impostazioni specifiche della gilda.",
    options: [
      {
        name: "manage_temp_channels",
        type: ApplicationCommandOptionType.Boolean,
        description: "Gestisci canali vocali temporanei.",
        required: false,
      },
      {
        name: "manage_hollyday_channels",
        type: ApplicationCommandOptionType.Boolean,
        description: "Gestisci canali per eventi/festività.",
        required: false,
      },
      {
        name: "welcome_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta canale benvenuto.",
        required: false,
        channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      },
      {
        name: "clear_welcome_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi canale benvenuto.",
        required: false,
      },
      {
        name: "log_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta canale log.",
        required: false,
        channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      },
      {
        name: "clear_log_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi canale log.",
        required: false,
      },
      {
        name: "rules_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta canale regolamento.",
        required: false,
        channel_types: [ChannelType.GuildText],
      },
      {
        name: "clear_rules_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi canale regolamento.",
        required: false,
      },
      {
        name: "boost_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta canale per i boost del server.",
        required: false,
        channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      },
      {
        name: "clear_boost_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi canale per i boost.",
        required: false,
      },
      {
        name: "announcement_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta canale per gli annunci importanti.",
        required: false,
        channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      },
      {
        name: "clear_announcement_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi canale per gli annunci.",
        required: false,
      },
      {
        name: "default_user_role",
        type: ApplicationCommandOptionType.Role,
        description: "Imposta ruolo default per nuovi utenti.",
        required: false,
      },
      {
        name: "clear_default_user_role",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi ruolo default utenti.",
        required: false,
      },
      {
        name: "default_bot_role",
        type: ApplicationCommandOptionType.Role,
        description: "Imposta ruolo default per nuovi bot.",
        required: false,
      },
      {
        name: "clear_default_bot_role",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi ruolo default bot.",
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    if (!interaction.inGuild()) {
      const emb = new PresetEmbed().KDanger(
        "Comando Non Utilizzabile Qui",
        "Solo in server."
      );
      return interaction
        .reply({ embeds: [emb], ephemeral: true })
        .catch((e) => BotConsole.error("Reply err:", e));
    }

    if (!interaction.deferred && !interaction.replied) {
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch (deferError) {
        BotConsole.error(`[SetGuild] Fallito deferReply:`, deferError);
        return;
      }
    }

    const { guild, guildId, member } = interaction;
    const guildName = guild.name;

    const embed = await new PresetEmbed({ guild, member }).init();

    try {
      if (!SqlManager.pool)
        await SqlManager.connect(ConfigManager.getConfig("sql"));
      await SqlManager.synchronizeGuild({ id: guildId, name: guildName });

      const fieldsToUpdateInGuild = {};
      let changesMadeSummary = [];
      let actionsTaken = false;

      // --- Gestione Moduli Complessi ---
      const tempResult = await handleTempChannels(interaction, guild, guildId);
      if (tempResult.summary) changesMadeSummary.push(tempResult.summary);
      if (tempResult.taken) actionsTaken = true;

      const holidayResult = await handleHolidayChannels(
        interaction,
        guild,
        guildId
      );
      if (holidayResult.summary) changesMadeSummary.push(holidayResult.summary);
      if (holidayResult.taken) actionsTaken = true;

      // --- Gestione Canali e Ruoli Semplici ---
      const optionsMap = {
        WELCOME_ID: { name: "welcome_channel", type: "channel" },
        LOG_ID: { name: "log_channel", type: "channel" },
        RULES_CH_ID: { name: "rules_channel", type: "channel" },
        BOOST_CH_ID: { name: "boost_channel", type: "channel" },
        ANNOUNCEMENT_CH_ID: { name: "announcement_channel", type: "channel" },
        ROLEDEFAULT_ID: { name: "default_user_role", type: "role" },
        ROLEBOTDEFAULT_ID: { name: "default_bot_role", type: "role" },
      };

      const optionLabels = {
        WELCOME_ID: "Benvenuto",
        LOG_ID: "Log",
        RULES_CH_ID: "Regolamento",
        BOOST_CH_ID: "Boost",
        ANNOUNCEMENT_CH_ID: "Annunci",
        ROLEDEFAULT_ID: "Ruolo Utenti",
        ROLEBOTDEFAULT_ID: "Ruolo Bot",
      };

      for (const [field, option] of Object.entries(optionsMap)) {
        const clearFlag = interaction.options.getBoolean(
          `clear_${option.name}`
        );

        // **LA CORREZIONE È QUI**
        // Usiamo i metodi specifici getChannel/getRole per ottenere l'oggetto corretto
        const input =
          option.type === "channel"
            ? interaction.options.getChannel(option.name)
            : interaction.options.getRole(option.name);

        if (clearFlag) {
          fieldsToUpdateInGuild[field] = null;
          changesMadeSummary.push(`🗑️ ${optionLabels[field]} RIMOSSO.`);
        } else if (input) {
          // Usiamo l'ID per il database e l'oggetto (che si converte in menzione) per il messaggio
          fieldsToUpdateInGuild[field] = input.id;
          changesMadeSummary.push(`✅ ${optionLabels[field]}: ${input}`);
        }
      }

      // --- Aggiornamento e Risposta ---
      if (Object.keys(fieldsToUpdateInGuild).length > 0) {
        await SqlManager.updateGuild(guildId, fieldsToUpdateInGuild);
        actionsTaken = true;
      }

      let finalMessageTitle = "Nessuna Modifica Necessaria";
      let finalMessageDescr =
        "Le impostazioni richieste erano già quelle correnti o nessuna azione specificata.";
      let finalThumb = STATUS_THUMBNAILS.INFO;

      if (actionsTaken || changesMadeSummary.some((s) => !s.startsWith("ℹ️"))) {
        finalMessageTitle = "Impostazioni Gilda Elaborate";
        finalMessageDescr = `Le configurazioni per **${guildName}** sono state processate:`;
        finalThumb = STATUS_THUMBNAILS.SUCCESS;
      } else if (interaction.options.data.length === 0) {
        finalMessageTitle = "Nessuna Operazione";
        finalMessageDescr =
          "Non hai specificato alcuna configurazione da modificare.";
      }

      embed
        .setMainContent(finalMessageTitle, finalMessageDescr)
        .setThumbnail(finalThumb);

      if (changesMadeSummary.length > 0) {
        embed.addFieldBlock(
          "📝 Riepilogo Azioni",
          changesMadeSummary.map((msg) => msg.replace(/^- /g, "• ")).join("\n")
        );
      }

      const finalGuildData = await SqlManager.getGuildById(guildId);
      if (finalGuildData) {
        embed.addFieldBlock("--- Stato Finale Configurazione ---", "\u200B");
        const finalTempData = await SqlManager.getTempChannelByGuildId(guildId);
        const finalHolidayData = await SqlManager.getHollydayByGuildId(guildId);

        embed.addFieldInline(
          "⏱️ Canali Temporanei",
          finalTempData ? `✅ Attivo` : "❌ Non attivo"
        );
        embed.addFieldInline(
          "🎉 Canali Festività",
          finalHolidayData ? `✅ Attivo` : "❌ Non attivo"
        );
        embed.addFieldInline("\u200B", "\u200B");

        for (const [field, label] of Object.entries(optionLabels)) {
          const value = finalGuildData[field];
          const isRole = field.includes("ROLE");
          const status = value
            ? `✅ ${isRole ? "<@&" : "<#"}${value}>`
            : "❌ Non impostato";
          embed.addFieldInline(label, status);
        }
      }

      if (holidayResult.taken) {
        const holidayModule = guild.client.other?.get("Holiday");
        if (holidayModule) {
          holidayModule.restart();
          BotConsole.info(
            `[SetGuild - ${guildId}] Processamento Holiday avviato per la gilda.`
          );
        }
      }

      return { embeds: [embed] };
    } catch (error) {
      BotConsole.error(`[SetGuild - ${guildId}] Errore critico:`, error);
      const errorReplyEmbed = new PresetEmbed({ guild });
      errorReplyEmbed
        .KDanger("Errore Inaspettato ❌", "Controlla la console.")
        .setThumbnail(STATUS_THUMBNAILS.ERROR);
      return { embeds: [errorReplyEmbed] };
    }
  },
};
