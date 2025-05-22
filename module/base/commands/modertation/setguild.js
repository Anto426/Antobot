// Comando: /setguild
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../../class/Sql/SqlManager.js";
import BotConsole from "../../../../class/console/BotConsole.js";
import ConfigManager from "../../../../class/ConfigManager/ConfigManager.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js"; // PermissionsBitField non serve più qui se rimosso

// Definisci i thumbnail all'inizio del file o importali
const STATUS_THUMBNAILS = {
  SUCCESS: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
  WARNING: "https://cdn-icons-png.flaticon.com/512/595/595067.png",
  ERROR: "https://cdn-icons-png.flaticon.com/512/463/463612.png",
  INFO: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
};

export default {
  name: "setguild",
  permissions: ["Administrator"], // Permesso utente per eseguire il comando
  isActive: true,
  isBotAllowed: false, // Se true, il bot stesso potrebbe usare il comando (raro per setguild)
  isOwnerOnly: false,
  // ... altre proprietà ...
  data: {
    name: "setguild",
    description: "Configura o aggiorna le impostazioni specifiche della gilda.",
    options: [
      {
        name: "manage_temp_channels",
        type: ApplicationCommandOptionType.Boolean,
        description: "Gestisci (abilita/disabilita) il sistema di canali vocali temporanei.",
        required: false,
      },
      {
        name: "manage_hollyday_channels",
        type: ApplicationCommandOptionType.Boolean,
        description: "Gestisci (abilita/disabilita) i canali per eventi/festività.",
        required: false,
      },
      {
        name: "welcome_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta il canale per i messaggi di benvenuto.",
        required: false,
        channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      },
      {
        name: "log_channel",
        type: ApplicationCommandOptionType.Channel,
        description: "Imposta il canale per i log del bot.",
        required: false,
        channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      },
      {
        name: "clear_welcome_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi la configurazione del canale di benvenuto.",
        required: false,
      },
      {
        name: "clear_log_channel",
        type: ApplicationCommandOptionType.Boolean,
        description: "Rimuovi la configurazione del canale dei log.",
        required: false,
      }
    ],
  },
  execute: async (interaction) => {
    if (!interaction.inGuild()) {
      const errorEmbed = new PresetEmbed().KDanger("Comando Non Utilizzabile Qui", "Questo comando può essere usato solo all'interno di un server.");
      try { // Prova a rispondere, potrebbe essere un'interazione non di comando
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      } catch (e) { BotConsole.error("Errore inviando reply per non in gilda:", e); return; }
    }

    // Defer Reply all'inizio per tutte le interazioni repliable
    if (interaction.isRepliable() && !interaction.deferred) {
        try {
            await interaction.deferReply({ ephemeral: true });
        } catch (deferError) {
            BotConsole.error(`[SetGuild] Fallito deferReply per ${interaction.id}:`, deferError);
            // Non possiamo fare molto se defer fallisce, l'interazione potrebbe essere scaduta
            return;
        }
    }

    const guild = interaction.guild;
    const guildId = guild.id;
    const guildName = guild.name;

    const manageTempChannelsFlag = interaction.options.getBoolean("manage_temp_channels");
    const manageHollydayChannelsFlag = interaction.options.getBoolean("manage_hollyday_channels");
    const welcomeChannelInput = interaction.options.getChannel("welcome_channel");
    const logChannelInput = interaction.options.getChannel("log_channel");
    const clearWelcomeChannel = interaction.options.getBoolean("clear_welcome_channel");
    const clearLogChannel = interaction.options.getBoolean("clear_log_channel");

    // Istanza dell'embed base
    const embed = await new PresetEmbed({ guild, member: interaction.member }).init();

    try {
      if (!SqlManager.pool) {
        BotConsole.info("[SetGuild] SqlManager.pool non inizializzato. Tentativo di connessione...");
        await SqlManager.connect(ConfigManager.getConfig("sql"));
      }

      await SqlManager.synchronizeGuild({ id: guildId, name: guildName });
      BotConsole.info(`[SetGuild] Gilda ${guildName} (${guildId}) sincronizzata/verificata.`);

      const fieldsToUpdateInGuild = {};
      let changesMadeSummary = []; // Array di stringhe per il riepilogo

      // --- A. Gestione Canali Temporanei ---
      if (manageTempChannelsFlag !== null) { // Utente ha specificato true o false
        const existingTempCfg = await SqlManager.getTempChannelById(guildId);
        if (manageTempChannelsFlag === true) {
          if (existingTempCfg) {
            changesMadeSummary.push(`ℹ️ Sistema Canali Temporanei già attivo (ID: \`${guildId}\`).`);
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = guildId;
          } else {
            const category = await guild.channels.create({ name: "🔊 Stanze Vocali Temporanee", type: ChannelType.GuildCategory, reason: `Setup /setguild da ${interaction.user.tag}` });
            const duoVc = await guild.channels.create({ name: "➕ Crea Duo", type: ChannelType.GuildVoice, parent: category.id, reason: `Setup /setguild da ${interaction.user.tag}` });
            // ... (crea trioVc, quartetVc, noLimitVc) ...
            const trioVc = await guild.channels.create({ name: "➕ Crea Trio", type: ChannelType.GuildVoice, parent: category.id, reason: `Setup /setguild da ${interaction.user.tag}` });
            const quartetVc = await guild.channels.create({ name: "➕ Crea Quartetto", type: ChannelType.GuildVoice, parent: category.id, reason: `Setup /setguild da ${interaction.user.tag}` });
            const noLimitVc = await guild.channels.create({ name: "➕ Crea Stanza Libera", type: ChannelType.GuildVoice, parent: category.id, reason: `Setup /setguild da ${interaction.user.tag}` });

            await SqlManager.addTempChannel({
                ID: guildId, CATEGORY_CH: category.id, DUO_CH: duoVc.id, TRIO_CH: trioVc.id, QUARTET_CH: quartetVc.id, NOLIMIT_CH: noLimitVc.id,
            });
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = guildId;
            changesMadeSummary.push("✅ Sistema Canali Temporanei **creato e abilitato**.");
          }
        } else { // manageTempChannelsFlag === false
          if (existingTempCfg) {
            const channelsToDelete = [ existingTempCfg.DUO_CH, existingTempCfg.TRIO_CH, existingTempCfg.QUARTET_CH, existingTempCfg.NOLIMIT_CH, existingTempCfg.CATEGORY_CH ].filter(id => id);
            for (const chId of channelsToDelete) {
                try { (await guild.channels.fetch(chId).catch(()=>null))?.delete(`Disabilitazione /setguild`); }
                catch (e) { BotConsole.warn(`[SetGuild] Impossibile eliminare canale temp ${chId}: ${e.message}`); }
            }
            await SqlManager.deleteTempChannel(guildId);
            fieldsToUpdateInGuild.TEMPCHANNEL_ID = null;
            changesMadeSummary.push("🗑️ Sistema Canali Temporanei **disabilitato e canali rimossi**.");
          } else {
            changesMadeSummary.push("ℹ️ Sistema Canali Temporanei già disabilitato.");
          }
        }
      }

      // --- B. Gestione Canali Hollyday ---
      if (manageHollydayChannelsFlag !== null) {
        const existingHollydayCfg = await SqlManager.getHollydayById(guildId);
        if (manageHollydayChannelsFlag === true) {
          if (existingHollydayCfg) {
            changesMadeSummary.push(`ℹ️ Sistema Canali Festività già attivo (ID: \`${guildId}\`).`);
            fieldsToUpdateInGuild.HOLYDAY_ID = guildId;
          } else {
            const category = await guild.channels.create({ name: "🎉 Eventi Speciali 🎉", type: ChannelType.GuildCategory, reason: `Setup /setguild da ${interaction.user.tag}` });
            const textCh = await guild.channels.create({ name: "📢 annunci-evento", type: ChannelType.GuildText, parent: category.id, reason: `Setup /setguild da ${interaction.user.tag}` });
            const voiceCh = await guild.channels.create({ name: "🥳 sala-evento", type: ChannelType.GuildVoice, parent: category.id, reason: `Setup /setguild da ${interaction.user.tag}` });
            await SqlManager.addHollyday({ ID: guildId, CATEGORY_CH: category.id, NAME_CHANNEL: textCh.id, HOLYDAY_CHANNEL: voiceCh.id });
            fieldsToUpdateInGuild.HOLYDAY_ID = guildId;
            changesMadeSummary.push("✅ Sistema Canali Festività **creato e abilitato**.");
          }
        } else { // manageHollydayChannelsFlag === false
          if (existingHollydayCfg) {
            const { CATEGORY_CH, NAME_CHANNEL, HOLYDAY_CHANNEL } = existingHollydayCfg;
            if (HOLYDAY_CHANNEL) { try { (await guild.channels.fetch(HOLYDAY_CHANNEL).catch(()=>null))?.delete(`Disabilitazione /setguild`); } catch(e){ BotConsole.warn(`Fail delete hollyday VC ${HOLYDAY_CHANNEL}: ${e.message}`); }}
            if (NAME_CHANNEL) { try { (await guild.channels.fetch(NAME_CHANNEL).catch(()=>null))?.delete(`Disabilitazione /setguild`); } catch(e){ BotConsole.warn(`Fail delete hollyday TC ${NAME_CHANNEL}: ${e.message}`); }}
            if (CATEGORY_CH) { try { (await guild.channels.fetch(CATEGORY_CH).catch(()=>null))?.delete(`Disabilitazione /setguild`); } catch(e){ BotConsole.warn(`Fail delete hollyday Cat ${CATEGORY_CH}: ${e.message}`); }}
            await SqlManager.deleteHollyday(guildId);
            fieldsToUpdateInGuild.HOLYDAY_ID = null;
            changesMadeSummary.push("🗑️ Sistema Canali Festività **disabilitato e canali/categoria rimossi**.");
          } else {
            changesMadeSummary.push("ℹ️ Sistema Canali Festività già disabilitato.");
          }
        }
      }

      // --- C. Gestione Welcome e Log channels ---
      if (clearWelcomeChannel) {
        fieldsToUpdateInGuild.WELCOME_ID = null;
        changesMadeSummary.push("🗑️ Canale Benvenuto **rimosso**.");
      } else if (welcomeChannelInput) {
        fieldsToUpdateInGuild.WELCOME_ID = welcomeChannelInput.id;
        changesMadeSummary.push(`✅ Canale Benvenuto impostato su: ${welcomeChannelInput}`);
      }

      if (clearLogChannel) {
        fieldsToUpdateInGuild.LOG_ID = null;
        changesMadeSummary.push("🗑️ Canale Log **rimosso**.");
      } else if (logChannelInput) {
        fieldsToUpdateInGuild.LOG_ID = logChannelInput.id;
        changesMadeSummary.push(`✅ Canale Log impostato su: ${logChannelInput}`);
      }
      
      let guildUpdatedInThisRun = false;
      if (Object.keys(fieldsToUpdateInGuild).length > 0) {
        const updateResult = await SqlManager.updateGuild(guildId, fieldsToUpdateInGuild);
        if (updateResult.affectedRows > 0) {
            guildUpdatedInThisRun = true;
            BotConsole.success(`[SetGuild - ${guildId}] Tabella GUILD aggiornata con: ${JSON.stringify(fieldsToUpdateInGuild)}`);
        }
      }
      
      // Determina lo stato generale e il thumbnail per l'embed
      if (changesMadeSummary.length === 0 && !guildUpdatedInThisRun) {
        if (manageTempChannelsFlag === null && manageHollydayChannelsFlag === null && !welcomeChannelInput && !logChannelInput && !clearWelcomeChannel && !clearLogChannel) {
             embed.KInfo("Nessuna Operazione", "Non hai specificato alcuna configurazione da modificare o rimuovere.");
             embed.setThumbnail(STATUS_THUMBNAILS.INFO);
        } else {
            embed.KInfo("Nessuna Modifica Effettuata", "Le impostazioni richieste erano già quelle correnti o nessuna azione è stata intrapresa.");
            embed.setThumbnail(STATUS_THUMBNAILS.INFO);
        }
      } else {
        embed.KSuccess("Impostazioni Gilda Elaborate", `Le configurazioni per **${guildName}** sono state processate.`);
        embed.setThumbnail(STATUS_THUMBNAILS.SUCCESS);
        if (changesMadeSummary.length > 0) {
            const summaryText = changesMadeSummary.map(msg => `${msg}`).join('\n'); // Mantiene le emoji all'inizio
            embed.addFieldBlock("📝 Riepilogo Azioni", summaryText);
        }
      }

      const finalGuildData = await SqlManager.getGuildById(guildId);
      if (!finalGuildData) {
          BotConsole.error(`[SetGuild - ${guildId}] CRITICO: Impossibile recuperare finalGuildData DOPO operazioni.`);
          // Se l'embed è già di errore, non sovrascriverlo, altrimenti impostalo
          if (embed.data.color !== STATUS_THUMBNAILS.ERROR) { // Presumendo che KDanger imposti questo colore
            embed.KDanger("Errore Interno", "Impossibile caricare lo stato finale della configurazione.");
            embed.setThumbnail(STATUS_THUMBNAILS.ERROR);
          }
          return interaction.editReply({ embeds: [embed] });
      }
      
      embed.addFieldBlock("--- Stato Finale Configurazione Attuale ---", "\u200B"); // Spaziatore con carattere invisibile
      embed.addFieldInline(
          "⏱️ Canali Temporanei",
          finalGuildData.TEMPCHANNEL_ID ? `✅ Attivo (ID: \`${finalGuildData.TEMPCHANNEL_ID}\`)` : "❌ Non attivo"
        )
        .addFieldInline(
          "🎉 Canali Festività",
          finalGuildData.HOLYDAY_ID ? `✅ Attivo (ID: \`${finalGuildData.HOLYDAY_ID}\`)` : "❌ Non attivo"
        )
        .addFieldInline("\u200B", "\u200B") // Campo vuoto per spaziatura se necessario
        .addFieldInline(
          "👋 Benvenuto",
          finalGuildData.WELCOME_ID ? `✅ <#${finalGuildData.WELCOME_ID}>` : "❌ Non impostato"
        )
        .addFieldInline(
          "📜 Log",
          finalGuildData.LOG_ID ? `✅ <#${finalGuildData.LOG_ID}>` : "❌ Non impostato"
        )
        .addFieldInline("\u200B", "\u200B");


      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      BotConsole.error(`[SetGuild - ${guildId}] Errore critico:`, error);
      console.error(`[SetGuild - ${guildId}] DETTAGLIO ERRORE CRITICO:`, error); // Stampa lo stack trace

      const errorReplyEmbed = new PresetEmbed({guild: interaction.guild}); // Embed di errore pulito
      
      if (error.code === 50013) { // DiscordAPIError: Missing Permissions
        errorReplyEmbed.KWarning("Permessi Discord Mancanti", "Il bot non ha i permessi necessari (probabilmente 'Gestire Canali') per eseguire questa azione.");
        errorReplyEmbed.setThumbnail(STATUS_THUMBNAILS.WARNING);
      } else {
        errorReplyEmbed.KDanger("Errore Inaspettato ❌", "Si è verificato un errore imprevisto. Controlla la console del bot per dettagli.");
        errorReplyEmbed.setThumbnail(STATUS_THUMBNAILS.ERROR);
      }

      try {
        // Non provare a editReply se deferReply è fallito (interazione sconosciuta)
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ embeds: [errorReplyEmbed], components: [] });
        } else if (interaction.isRepliable()){ // Tenta un reply se non è stato fatto defer/reply (caso raro)
            await interaction.reply({ embeds: [errorReplyEmbed], ephemeral: true, components: [] });
        }
      } catch (replyError) {
        BotConsole.error("[SetGuild] Errore anche nel rispondere con messaggio di errore di fallback:", replyError);
      }
    }
  },
};