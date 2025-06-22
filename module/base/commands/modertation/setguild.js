import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../../class/Sql/SqlManager.js";
import BotConsole from "../../../../class/console/BotConsole.js";
import ConfigManager from "../../../../class/ConfigManager/ConfigManager.js";
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

export default {
  name: "setguild",
  permissions: [PermissionsBitField.Flags.Administrator], // Cambiato a Administrator per più coerenza
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

    const guild = interaction.guild;
    const guildId = guild.id;
    const guildName = guild.name;

    const manageTempChannelsFlag = interaction.options.getBoolean(
      "manage_temp_channels"
    );
    const manageHollydayChannelsFlag = interaction.options.getBoolean(
      "manage_hollyday_channels"
    );
    const welcomeChannelInput =
      interaction.options.getChannel("welcome_channel");
    const logChannelInput = interaction.options.getChannel("log_channel");
    const defaultUserRoleInput =
      interaction.options.getRole("default_user_role");
    const defaultBotRoleInput = interaction.options.getRole("default_bot_role");

    const clearWelcomeChannel = interaction.options.getBoolean(
      "clear_welcome_channel"
    );
    const clearLogChannel = interaction.options.getBoolean("clear_log_channel");
    const clearDefaultUserRole = interaction.options.getBoolean(
      "clear_default_user_role"
    );
    const clearDefaultBotRole = interaction.options.getBoolean(
      "clear_default_bot_role"
    );

    const embed = await new PresetEmbed({
      guild,
      member: interaction.member,
    }).init();

    try {
      if (!SqlManager.pool)
        await SqlManager.connect(ConfigManager.getConfig("sql"));
      await SqlManager.synchronizeGuild({ id: guildId, name: guildName });

      const fieldsToUpdateInGuild = {};
      let changesMadeSummary = [];

      // Temp Channels
      if (manageTempChannelsFlag !== null) {
        const cfg = await SqlManager.getTempChannelById(guildId);
        if (manageTempChannelsFlag) {
          if (cfg) changesMadeSummary.push(`ℹ️ Canali Temporanei già attivi.`);
          else {
            const r = `Setup /setguild da ${interaction.user.tag}`;
            const cat = await guild.channels.create({
              name: "🔊 VOCALI TEMPORANEI 🔊",
              type: ChannelType.GuildCategory,
              reason: r,
            });
            const vc1 = await guild.channels.create({
              name: "➕ Crea Duo",
              type: ChannelType.GuildVoice,
              parent: cat.id,
              reason: r,
            });
            const vc2 = await guild.channels.create({
              name: "➕ Crea Trio",
              type: ChannelType.GuildVoice,
              parent: cat.id,
              reason: r,
            });
            const vc3 = await guild.channels.create({
              name: "➕ Crea Quartetto",
              type: ChannelType.GuildVoice,
              parent: cat.id,
              reason: r,
            });
            const vc4 = await guild.channels.create({
              name: "➕ Crea Libera",
              type: ChannelType.GuildVoice,
              parent: cat.id,
              reason: r,
            });
            await SqlManager.addTempChannel({
              ID: guildId,
              CATEGORY_CH: cat.id,
              DUO_CH: vc1.id,
              TRIO_CH: vc2.id,
              QUARTET_CH: vc3.id,
              NOLIMIT_CH: vc4.id,
            });
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = guildId;
            changesMadeSummary.push("✅ Canali Temporanei CREATI.");
          }
        } else {
          if (cfg) {
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
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = null;
            changesMadeSummary.push("🗑️ Canali Temporanei DISABILITATI.");
          } else
            changesMadeSummary.push("ℹ️ Canali Temporanei già disabilitati.");
        }
      }

      // Hollyday Channels
      if (manageHollydayChannelsFlag !== null) {
        const cfg = await SqlManager.getHollydayById(guildId);
        const reason = `Setup /setguild Eventi da ${interaction.user.tag}`;
        const lockedPerms = [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.Connect],
          },
        ];
        if (manageHollydayChannelsFlag) {
          if (cfg) changesMadeSummary.push(`ℹ️ Canali Eventi già attivi.`);
          else {
            const cat = await guild.channels.create({
              name: "🎉 Eventi Speciali 🎉",
              type: ChannelType.GuildCategory,
              reason,
            });
            const tc = await guild.channels.create({
              name: "📢 annunci-evento",
              type: ChannelType.GuildVoice,
              parent: cat.id,
              permissionOverwrites: lockedPerms,
              reason,
            });
            const vc = await guild.channels.create({
              name: "🥳 sala-evento",
              type: ChannelType.GuildVoice,
              parent: cat.id,
              permissionOverwrites: lockedPerms,
              reason,
            });
            await SqlManager.addHollyday({
              ID: guildId,
              CATEGORY_CH: cat.id,
              NAME_CHANNEL: tc.id,
              HOLYDAY_CHANNEL: vc.id,
            });
            fieldsToUpdateInGuild.HOLYDAY_ID = guildId;
            changesMadeSummary.push(
              "✅ Canali Eventi CREATI (vocale bloccato)."
            );
          }
        } else {
          if (cfg) {
            const ids = [
              cfg.NAME_CHANNEL,
              cfg.HOLYDAY_CHANNEL,
              cfg.CATEGORY_CH,
            ].filter(Boolean);
            for (const id of ids) {
              try {
                (await guild.channels.fetch(id).catch(() => null))?.delete();
              } catch (e) {
                BotConsole.warning(`Del HollyCh ${id} err: ${e.message}`);
              }
            }
            await SqlManager.deleteHollyday(guildId);
            fieldsToUpdateInGuild.HOLYDAY_ID = null;
            changesMadeSummary.push("🗑️ Canali Eventi DISABILITATI.");
          } else changesMadeSummary.push("ℹ️ Canali Eventi già disabilitati.");
        }
      }

      // Welcome Channel
      if (clearWelcomeChannel) {
        fieldsToUpdateInGuild.WELCOME_ID = null;
        changesMadeSummary.push("🗑️ Canale Benvenuto RIMOSSO.");
      } else if (welcomeChannelInput) {
        fieldsToUpdateInGuild.WELCOME_ID = welcomeChannelInput.id;
        changesMadeSummary.push(`✅ Canale Benvenuto: ${welcomeChannelInput}`);
      }

      // Log Channel
      if (clearLogChannel) {
        fieldsToUpdateInGuild.LOG_ID = null;
        changesMadeSummary.push("🗑️ Canale Log RIMOSSO.");
      } else if (logChannelInput) {
        fieldsToUpdateInGuild.LOG_ID = logChannelInput.id;
        changesMadeSummary.push(`✅ Canale Log: ${logChannelInput}`);
      }

      // Default User Role
      if (clearDefaultUserRole) {
        fieldsToUpdateInGuild.ROLEDEFAULT_ID = null;
        changesMadeSummary.push("🗑️ Ruolo Default Utenti RIMOSSO.");
      } else if (defaultUserRoleInput) {
        fieldsToUpdateInGuild.ROLEDEFAULT_ID = defaultUserRoleInput.id;
        changesMadeSummary.push(
          `✅ Ruolo Default Utenti: ${defaultUserRoleInput}`
        );
      }

      // Default Bot Role
      if (clearDefaultBotRole) {
        fieldsToUpdateInGuild.ROLEBOTDEFAULT_ID = null;
        changesMadeSummary.push("🗑️ Ruolo Default Bot RIMOSSO.");
      } else if (defaultBotRoleInput) {
        fieldsToUpdateInGuild.ROLEBOTDEFAULT_ID = defaultBotRoleInput.id;
        changesMadeSummary.push(`✅ Ruolo Default Bot: ${defaultBotRoleInput}`);
      }

      let finalMessageTitle = "Nessuna Modifica Necessaria";
      let finalMessageDescr =
        "Le impostazioni richieste erano già quelle correnti o nessuna azione specificata.";
      let finalThumb = STATUS_THUMBNAILS.INFO;

      if (Object.keys(fieldsToUpdateInGuild).length > 0) {
        await SqlManager.updateGuild(guildId, fieldsToUpdateInGuild);
        finalMessageTitle = "Impostazioni Gilda Aggiornate";
        finalMessageDescr = `Le configurazioni per **${guildName}** sono state elaborate:`;
        finalThumb = STATUS_THUMBNAILS.SUCCESS;
      } else if (
        changesMadeSummary.some((s) => s.startsWith("✅") || s.startsWith("🗑️"))
      ) {
        // Azioni intraprese anche se non c'è update diretto a GUILD
        finalMessageTitle = "Impostazioni Gilda Elaborate";
        finalMessageDescr = `Le configurazioni per **${guildName}** sono state processate:`;
        finalThumb = STATUS_THUMBNAILS.SUCCESS;
      } else if (
        manageTempChannelsFlag === null &&
        manageHollydayChannelsFlag === null &&
        !welcomeChannelInput &&
        !logChannelInput &&
        !defaultUserRoleInput &&
        !defaultBotRoleInput &&
        !clearWelcomeChannel &&
        !clearLogChannel &&
        !clearDefaultUserRole &&
        !clearDefaultBotRole
      ) {
        finalMessageTitle = "Nessuna Operazione";
        finalMessageDescr =
          "Non hai specificato alcuna configurazione da modificare.";
      }

      embed
        .setMainContent(finalMessageTitle, finalMessageDescr)
        .setThumbnail(finalThumb);

      if (changesMadeSummary.length > 0) {
        const summaryText = changesMadeSummary
          .map((msg) => msg.replace(/^- /g, "• "))
          .join("\n");
        embed.addFieldBlock("📝 Riepilogo Azioni", summaryText);
      }

      const finalGuildData = await SqlManager.getGuildById(guildId);
      if (
        !finalGuildData &&
        (Object.keys(fieldsToUpdateInGuild).length > 0 ||
          changesMadeSummary.length > 0)
      ) {
        BotConsole.error(
          `[SetGuild - ${guildId}] CRITICO: Impossibile recuperare finalGuildData DOPO operazioni.`
        );
        embed.KDanger(
          "Errore Interno Grave",
          "Impossibile caricare stato finale."
        );
      } else if (finalGuildData) {
        embed
          .addFieldBlock("--- Stato Finale Configurazione ---", "\u200B")
          .addFieldInline(
            "⏱️ Canali Temporanei",
            finalGuildData.TEMPCHANNEL_ID ? `✅ Attivo` : "❌ Non attivo"
          )
          .addFieldInline(
            "🎉 Canali Festività",
            finalGuildData.HOLYDAY_ID ? `✅ Attivo` : "❌ Non attivo"
          )
          .addFieldInline("\u200B", "\u200B")
          .addFieldInline(
            "👋 Benvenuto",
            finalGuildData.WELCOME_ID
              ? `✅ <#${finalGuildData.WELCOME_ID}>`
              : "❌ Non impostato"
          )
          .addFieldInline(
            "📜 Log",
            finalGuildData.LOG_ID
              ? `✅ <#${finalGuildData.LOG_ID}>`
              : "❌ Non impostato"
          )
          .addFieldInline("\u200B", "\u200B")
          .addFieldInline(
            "👤 Ruolo Utenti",
            finalGuildData.ROLEDEFAULT_ID
              ? `✅ <@&${finalGuildData.ROLEDEFAULT_ID}>`
              : "❌ Non impostato"
          )
          .addFieldInline(
            "🤖 Ruolo Bot",
            finalGuildData.ROLEBOTDEFAULT_ID
              ? `✅ <@&${finalGuildData.ROLEBOTDEFAULT_ID}>`
              : "❌ Non impostato"
          );

        const holidayModule = guild.client.other?.get("Holiday");

        if (holidayModule) {
          holidayModule.restart();
          BotConsole.info(
            `[SetGuild - ${guildId}] Processamento Holiday avviato per la gilda.`
          );
        } else {
          BotConsole.warning(
            `[SetGuild - ${guildId}] Modulo Holiday non trovato, non avviato il processo di configurazione eventi.`
          );
        }
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      BotConsole.error(`[SetGuild - ${guildId}] Errore critico:`, error);

      const errorReplyEmbed = new PresetEmbed({ guild: interaction.guild });
      if (error.code === 50013) {
        errorReplyEmbed
          .KWarning(
            "Permessi Discord Mancanti",
            "Il bot non ha i permessi necessari."
          )
          .setThumbnail(STATUS_THUMBNAILS.WARNING);
      } else {
        errorReplyEmbed
          .KDanger("Errore Inaspettato ❌", "Controlla la console.")
          .setThumbnail(STATUS_THUMBNAILS.ERROR);
      }
      try {
        if (interaction.replied || interaction.deferred)
          await interaction.editReply({
            embeds: [errorReplyEmbed],
            components: [],
          });
        else if (interaction.isRepliable())
          await interaction.reply({
            embeds: [errorReplyEmbed],
            ephemeral: true,
            components: [],
          });
      } catch (replyError) {
        BotConsole.error(
          "[SetGuild] Errore rispondendo con errore fallback:",
          replyError
        );
      }
    }
  },
};
