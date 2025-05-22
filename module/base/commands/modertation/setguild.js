// Comando: /setguild
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../../class/Sql/SqlManager.js";
import BotConsole from "../../../../class/console/BotConsole.js";
import ConfigManager from "../../../../class/ConfigManager/ConfigManager.js";
import {
  PermissionsBitField,
  ApplicationCommandOptionType,
  ChannelType,
} from "discord.js";

export default {
  name: "setguild",
  permissions: [PermissionsBitField.Flags.ManageGuild],
  isActive: true,
  isBotAllowed: false, // Nota: se il bot non è permesso, il comando non dovrebbe eseguire logica di gilda
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "setguild",
    description: "Configura o aggiorna le impostazioni specifiche della gilda.",
    options: [
      // ... (opzioni come prima) ...
    ],
  },
  execute: async (interaction) => {
    // ... (logica iniziale e recupero opzioni come prima) ...
    if (!interaction.inGuild()) {
      const errorEmbed = new PresetEmbed().KDanger(
        "Comando non disponibile",
        "Questo comando può essere usato solo all'interno di un server."
      );
      // Se deferReply non è ancora stato chiamato, usa reply()
      if (!interaction.deferred && !interaction.replied) {
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      } else {
        return interaction.editReply({ embeds: [errorEmbed] }); // Già deferred, usa editReply
      }
    }

    // Assicurati che deferReply sia chiamato solo una volta e all'inizio
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    const guild = interaction.guild;
    const guildId = guild.id;
    const guildName = guild.name;

    const manageTempChannelsFlag = interaction.options.getBoolean(
      "manage_temp_channels"
      // Rimuovi il secondo parametro 'false' da getBoolean se vuoi che sia null se non fornito,
      // altrimenti sarà sempre true o false. Il tuo null check `manageTempChannelsFlag !== null` funzionerà comunque.
    );
    const manageHollydayChannelsFlag = interaction.options.getBoolean(
      "manage_hollyday_channels"
    );
    const welcomeChannelInput =
      interaction.options.getChannel("welcome_channel");
    const logChannelInput = interaction.options.getChannel("log_channel");
    const clearWelcomeChannel = interaction.options.getBoolean(
      "clear_welcome_channel"
    );
    const clearLogChannel = interaction.options.getBoolean("clear_log_channel");

    const embed = await new PresetEmbed({
      // Istanzia l'embed qui
      guild,
      member: interaction.member,
    }).init(); // Assicurati che init() restituisca this o una Promise<this>

    try {
      if (!SqlManager.pool) {
        BotConsole.info(
          "[SetGuild] SqlManager.pool non inizializzato. Tentativo di connessione..."
        );
        await SqlManager.connect(ConfigManager.getConfig("sql"));
      }

      await SqlManager.synchronizeGuild({ id: guildId, name: guildName });
      BotConsole.info(
        `[SetGuild] Gilda ${guildName} (${guildId}) sincronizzata/verificata.`
      );

      const fieldsToUpdateInGuild = {};
      let changesMadeSummary = [];

      // --- A. Gestione Canali Temporanei ---
      // ... (logica invariata, non usa addField direttamente) ...
      if (manageTempChannelsFlag !== null) {
        const existingTempChannelConfig = await SqlManager.getTempChannelById(
          guildId
        );

        if (manageTempChannelsFlag === true) {
          BotConsole.info(
            `[SetGuild - ${guildId}] Richiesta di abilitare/creare canali temporanei.`
          );
          if (existingTempChannelConfig) {
            changesMadeSummary.push(
              "ℹ️ Sistema canali temporanei già configurato (ID Config: " +
                guildId +
                "). Per ricreare, disabilitare prima."
            );
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = guildId;
          } else {
            BotConsole.info(
              `[SetGuild - ${guildId}] Creazione nuovo setup per canali temporanei...`
            );
            const category = await guild.channels.create({
              name: "🔊 VOCALI TEMPORANEI 🔊",
              type: ChannelType.GuildCategory,
            });
            const duoVc = await guild.channels.create({
              name: "➕ Duo Vocale",
              type: ChannelType.GuildVoice,
              parent: category.id,
            });
            const trioVc = await guild.channels.create({
              name: "➕ Trio Vocale",
              type: ChannelType.GuildVoice,
              parent: category.id,
            });
            const quartetVc = await guild.channels.create({
              name: "➕ Quartetto Vocale",
              type: ChannelType.GuildVoice,
              parent: category.id,
            });
            const noLimitVc = await guild.channels.create({
              name: "➕ No-Limit Vocale",
              type: ChannelType.GuildVoice,
              parent: category.id,
            });

            await SqlManager.addTempChannel({
              ID: guildId,
              CATEGORY_CH: category.id,
              DUO_CH: duoVc.id,
              TRIO_CH: trioVc.id,
              QUARTET_CH: quartetVc.id,
              NOLIMIT_CH: noLimitVc.id,
            });
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = guildId;
            changesMadeSummary.push(
              "✅ Sistema canali temporanei CREATO e ABILITATO."
            );
            BotConsole.success(
              `[SetGuild - ${guildId}] Record TEMP_CHANNEL e link gilda creati.`
            );
          }
        } else {
          // manageTempChannelsFlag === false
          BotConsole.info(
            `[SetGuild - ${guildId}] Richiesta di disabilitare canali temporanei.`
          );
          if (existingTempChannelConfig) {
            BotConsole.info(
              `[SetGuild - ${guildId}] Rimozione configurazione canali temporanei esistente...`
            );
            const channelsToDelete = [
              existingTempChannelConfig.CATEGORY_CH,
              existingTempChannelConfig.DUO_CH,
              existingTempChannelConfig.TRIO_CH,
              existingTempChannelConfig.QUARTET_CH,
              existingTempChannelConfig.NOLIMIT_CH,
            ].filter((id) => id);
            for (const chId of channelsToDelete) {
              try {
                (await guild.channels.fetch(chId).catch(() => null))?.delete(
                  `Disabilitazione temp channels da /setguild`
                );
              } catch (e) {
                BotConsole.warning(
                  `[SetGuild] Impossibile eliminare canale temp ${chId} (Gilda ${guildId}): ${e.message}`
                );
              }
            }
            await SqlManager.deleteTempChannel(guildId);
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = null;
            changesMadeSummary.push(
              "🗑️ Sistema canali temporanei DISABILITATO e canali rimossi."
            );
            BotConsole.success(
              `[SetGuild - ${guildId}] Setup TEMP_CHANNEL rimosso.`
            );
          } else {
            changesMadeSummary.push(
              "ℹ️ Sistema canali temporanei già disabilitato. Nessuna azione."
            );
          }
        }
      }

      // --- B. Gestione Canali Hollyday ---
      // ... (logica invariata, non usa addField direttamente) ...
      if (manageHollydayChannelsFlag !== null) {
        const existingHollydayConfig = await SqlManager.getHollydayById(
          guildId
        );

        if (manageHollydayChannelsFlag === true) {
          BotConsole.info(
            `[SetGuild - ${guildId}] Richiesta di abilitare/creare canali festività.`
          );
          if (existingHollydayConfig) {
            changesMadeSummary.push(
              "ℹ️ Sistema canali festività già configurato (ID Config: " +
                guildId +
                "). Per ricreare, disabilitare prima."
            );
            fieldsToUpdateInGuild.HOLYDAY_ID = guildId;
          } else {
            BotConsole.info(
              `[SetGuild - ${guildId}] Creazione nuovo setup per canali festività...`
            );
            const category = await guild.channels.create({
              name: "🎉 Eventi Speciali 🎉",
              type: ChannelType.GuildCategory,
            });
            const textChannel = await guild.channels.create({
              name: "📢 annunci-evento",
              type: ChannelType.GuildText,
              parent: category.id,
            });
            const voiceChannel = await guild.channels.create({
              name: "🥳 sala-evento",
              type: ChannelType.GuildVoice,
              parent: category.id,
            });

            await SqlManager.addHollyday({
              ID: guildId,
              CATEGORY_CH: category.id,
              NAME_CHANNEL: textChannel.id,
              HOLYDAY_CHANNEL: voiceChannel.id,
            });
            fieldsToUpdateInGuild.HOLYDAY_ID = guildId;
            changesMadeSummary.push(
              "✅ Sistema canali festività CREATO e ABILITATO."
            );
            BotConsole.success(
              `[SetGuild - ${guildId}] Record HOLLYDAY e link gilda creati.`
            );
          }
        } else {
          // manageHollydayChannelsFlag === false
          BotConsole.info(
            `[SetGuild - ${guildId}] Richiesta di disabilitare canali festività.`
          );
          if (existingHollydayConfig) {
            BotConsole.info(
              `[SetGuild - ${guildId}] Rimozione configurazione canali festività esistente...`
            );
            const categoryId = existingHollydayConfig.CATEGORY_CH;
            const textChannelId = existingHollydayConfig.NAME_CHANNEL;
            const voiceChannelId = existingHollydayConfig.HOLYDAY_CHANNEL;

            if (voiceChannelId) {
              try {
                (
                  await guild.channels.fetch(voiceChannelId).catch(() => null)
                )?.delete("Disabilitazione hollyday channels");
                BotConsole.info(
                  `[SetGuild] Canale festività VC ${voiceChannelId} eliminato.`
                );
              } catch (e) {
                BotConsole.warning(
                  `[SetGuild] Fail delete hollyday VC ${voiceChannelId}: ${e.message}`
                );
              }
            }
            if (textChannelId) {
              try {
                (
                  await guild.channels.fetch(textChannelId).catch(() => null)
                )?.delete("Disabilitazione hollyday channels");
                BotConsole.info(
                  `[SetGuild] Canale festività TC ${textChannelId} eliminato.`
                );
              } catch (e) {
                BotConsole.warning(
                  `[SetGuild] Fail delete hollyday TC ${textChannelId}: ${e.message}`
                );
              }
            }
            if (categoryId) {
              try {
                (
                  await guild.channels.fetch(categoryId).catch(() => null)
                )?.delete("Disabilitazione hollyday channels");
                BotConsole.info(
                  `[SetGuild] Categoria festività ${categoryId} eliminata.`
                );
              } catch (e) {
                BotConsole.warning(
                  `[SetGuild] Fail delete hollyday Cat ${categoryId}: ${e.message}`
                );
              }
            }

            await SqlManager.deleteHollyday(guildId);
            fieldsToUpdateInGuild.HOLYDAY_ID = null;
            changesMadeSummary.push(
              "🗑️ Sistema canali festività DISABILITATO e canali/categoria rimossi."
            );
            BotConsole.success(
              `[SetGuild - ${guildId}] Setup HOLLYDAY rimosso.`
            );
          } else {
            changesMadeSummary.push(
              "ℹ️ Sistema canali festività già disabilitato. Nessuna azione."
            );
          }
        }
      }

      // --- C. Gestione Welcome e Log channels ---
      // ... (logica invariata, non usa addField direttamente) ...
      if (clearWelcomeChannel) {
        fieldsToUpdateInGuild.WELCOME_ID = null;
        changesMadeSummary.push("🗑️ Canale Benvenuto rimosso.");
      } else if (welcomeChannelInput) {
        fieldsToUpdateInGuild.WELCOME_ID = welcomeChannelInput.id;
        changesMadeSummary.push(
          `- Canale Benvenuto impostato su: ${welcomeChannelInput}`
        );
      }

      if (clearLogChannel) {
        fieldsToUpdateInGuild.LOG_ID = null;
        changesMadeSummary.push("🗑️ Canale Log rimosso.");
      } else if (logChannelInput) {
        fieldsToUpdateInGuild.LOG_ID = logChannelInput.id;
        changesMadeSummary.push(
          `- Canale Log impostato su: ${logChannelInput}`
        );
      }

      // Applica gli aggiornamenti alla tabella GUILD se ci sono modifiche
      // ... (logica invariata) ...
      if (Object.keys(fieldsToUpdateInGuild).length > 0) {
        await SqlManager.updateGuild(guildId, fieldsToUpdateInGuild);
        BotConsole.success(
          `[SetGuild - ${guildId}] Tabella GUILD aggiornata con: ${JSON.stringify(
            fieldsToUpdateInGuild
          )}`
        );
      } else if (
        manageTempChannelsFlag === null && // Solo se l'opzione non è stata usata
        manageHollydayChannelsFlag === null && // Solo se l'opzione non è stata usata
        !welcomeChannelInput &&
        !logChannelInput &&
        !clearWelcomeChannel &&
        !clearLogChannel
      ) {
        embed.KInfo(
          "Nessuna Operazione",
          "Non hai specificato alcuna configurazione da modificare o rimuovere."
        );
        return interaction.editReply({ embeds: [embed] });
      }

      // Feedback finale all'utente
      BotConsole.debug(`[SetGuild - ${guildId}] Recupero dati finali gilda...`);
      const finalGuildData = await SqlManager.getGuildById(guildId);
      BotConsole.debug(
        `[SetGuild - ${guildId}] Dati finali gilda recuperati:`,
        finalGuildData
      );

      if (!finalGuildData && Object.keys(fieldsToUpdateInGuild).length > 0) {
        // Controllo se la gilda esiste dopo un tentativo di update
        BotConsole.error(
          `[SetGuild - ${guildId}] ERRORE FATALE: Impossibile recuperare i dati della gilda ${guildId} dopo l'aggiornamento!`
        );
        embed.KDanger(
          "Errore Interno",
          "Impossibile confermare le modifiche; dati gilda non trovati post-aggiornamento."
        );
        return interaction.editReply({ embeds: [embed] });
      }

      const guildStillExists = !!finalGuildData; // Per i campi finali, nel caso la gilda fosse stata cancellata da un altro processo (improbabile qui)

      if (changesMadeSummary.length > 0) {
        embed.KSuccess(
          "Impostazioni Gilda Elaborate",
          `Le seguenti azioni sono state intraprese per **${guildName}**:`
        );
        changesMadeSummary.forEach((msg) =>
          // USA I TUOI METODI HELPER PER AGGIUNGERE CAMPI
          embed.addFieldBlock(
            // o addFieldInline se preferisci
            "Riepilogo Azione",
            msg.replace(/^- |^✅ |^🗑️ |^ℹ️ |^⚠️ /g, "") // Rimuove i prefissi
          )
        );
      } else {
        embed.KInfo(
          "Nessuna Modifica Effettuata",
          "Nessuna configurazione è stata modificata."
        );
      }

      // USA I TUOI METODI HELPER PER AGGIUNGERE CAMPI
      embed
        .addFieldBlock("--- Stato Finale Configurazione ---", "_ _") // Usa addFieldBlock o addFieldInline
        .addFieldInline(
          // addFieldInline per campi affiancati
          "Sistema Canali Temporanei",
          guildStillExists && finalGuildData.TEMPCHANNEL_ID
            ? `Attivo (ID Config: \`${finalGuildData.TEMPCHANNEL_ID}\`)`
            : "Non attivo"
        )
        .addFieldInline(
          "Sistema Canali Festività",
          guildStillExists && finalGuildData.HOLYDAY_ID
            ? `Attivo (ID Config: \`${finalGuildData.HOLYDAY_ID}\`)`
            : "Non attivo"
        )
        .addFieldInline(
          "Canale Benvenuto",
          guildStillExists && finalGuildData.WELCOME_ID
            ? `<#${finalGuildData.WELCOME_ID}>`
            : "Non impostato"
        )
        .addFieldInline(
          "Canale Log",
          guildStillExists && finalGuildData.LOG_ID
            ? `<#${finalGuildData.LOG_ID}>`
            : "Non impostato"
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      BotConsole.error(`[SetGuild - ${guildId}] Errore critico:`, error);
      console.error(`[SetGuild - ${guildId}] DETTAGLIO ERRORE CRITICO:`, error); // MOLTO IMPORTANTE PER DEBUG

      let userErrorMessage =
        "Si è verificato un errore imprevisto. Controlla la console del bot.";
      // Crea un embed di errore minimale e sicuro, non fare affidamento sull'embed principale
      // che potrebbe essere in uno stato inconsistente o la cui creazione potrebbe essere fallita.
      const errorReplyEmbed = new PresetEmbed({ guild: interaction.guild }); // Passa guild se il costruttore lo richiede
      // Non chiamare .init() se potrebbe fallire o se non è necessario per KDanger

      if (error.code === 50013) {
        userErrorMessage =
          "Errore di Permessi: Il bot non ha i permessi necessari per eseguire questa azione.";
        errorReplyEmbed.KWarning("Permessi Discord Mancanti", userErrorMessage);
      } else {
        errorReplyEmbed.KDanger("Errore Inaspettato ❌", userErrorMessage);
      }

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({
            embeds: [errorReplyEmbed],
            components: [],
          });
        } else {
          // Se deferReply non è mai stato chiamato o è fallito, potremmo non poter rispondere.
          // Tentare un reply qui è rischioso e potrebbe dare "Unknown interaction" o "Already acknowledged".
          BotConsole.error(
            "[SetGuild] Impossibile inviare messaggio di errore: interazione non deferred/replied in modo sicuro."
          );
          // await interaction.reply({ embeds: [errorReplyEmbed], ephemeral: true, components: [] });
        }
      } catch (replyError) {
        BotConsole.error(
          "[SetGuild] Errore anche nel rispondere con messaggio di errore di fallback:",
          replyError
        );
      }
    }
  },
};
