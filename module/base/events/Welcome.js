// Percorso ipotetico: module/base/events/NewMemberJoin.js

import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/Sql/SqlManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import ConfigManager from "../../../class/ConfigManager/ConfigManager.js"; // Importato
import { Events, PermissionsBitField, AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import DynamicColor from "../../../class/color/DynamicColor.js"; // ADATTA IL PERCORSO!
import SystemCheck from "../../../class/client/SystemCheck.js";

let canvasSettingsGlobal = null; // Inizializzato a null
let fontsHaveBeenRegistered = false;

// Funzione da chiamare una volta all'avvio del bot per caricare le config e registrare i font
export function initializeWelcomeImageSystem() {
  if (!canvasSettingsGlobal) {
    canvasSettingsGlobal = SystemCheck.getAssetPath("canvas");
    if (!canvasSettingsGlobal) {
      BotConsole.error(
        "[WelcomeImgInit] Configurazione 'canvas_settings' non trovata in ConfigManager."
      );
      return; // Esce se la configurazione base manca
    }
  }

  if (fontsHaveBeenRegistered || !canvasSettingsGlobal.font) {
    if (fontsHaveBeenRegistered)
      BotConsole.debug("[WelcomeImgInit] Font già registrati.");
    else
      BotConsole.warning(
        "[WelcomeImgInit] Configurazione font mancante in 'canvas_settings'."
      );
    return;
  }

  try {
    const baseDir = process.env.DIRBOT || process.cwd();
    canvasSettingsGlobal.font.name.forEach((fontFile) => {
      if (typeof fontFile !== "string") {
        BotConsole.warning(
          `[WelcomeImgInit] Nome file font non valido: ${fontFile}`
        );
        return;
      }
      const fontPath = path.join(
        baseDir,
        canvasSettingsGlobal.font.dir,
        fontFile
      );
      const fontFamily = fontFile.split(".")[0];
      registerFont(fontPath, { family: fontFamily });
      BotConsole.info(
        `[WelcomeImgInit] Font registrato: ${fontFamily} da ${fontPath}`
      );
    });
    fontsHaveBeenRegistered = true;
  } catch (fontError) {
    BotConsole.error(
      "[WelcomeImgInit] Fallita registrazione font personalizzati.",
      fontError
    );
    fontsHaveBeenRegistered = true; // Segna comunque per non riprovare all'infinito
  }
}

// Chiamata a initializeWelcomeImageSystem()
// Questa chiamata dovrebbe avvenire nel file principale del tuo bot, dopo che ConfigManager è stato inizializzato
// e PRIMA che qualsiasi evento `guildMemberAdd` possa essere processato.
// Esempio (nel tuo file bot.js o index.js):
//
// import ConfigManager from './class/ConfigManager/ConfigManager.js';
// import { initializeWelcomeImageSystem } from './module/base/events/NewMemberJoin.js'; // Adatta percorso
//
// async function startBot() {
//   await ConfigManager.loadConfig(); // o il tuo metodo di init
//   initializeWelcomeImageSystem(); // Inizializza il sistema immagine benvenuto
//   // ... resto del codice di avvio del bot ...
//   client.login(token);
// }
// startBot();

async function generateWelcomeImage(member, guildMemberCount) {
  // Ora canvasSettingsGlobal dovrebbe essere già popolato dalla chiamata a initializeWelcomeImageSystem() all'avvio.
  if (
    !canvasSettingsGlobal ||
    !canvasSettingsGlobal.welcome_image ||
    !canvasSettingsGlobal.font ||
    !fontsHaveBeenRegistered
  ) {
    BotConsole.error(
      "[WelcomeImg] Sistema immagine benvenuto non inizializzato correttamente (config o font mancanti/non registrati)."
    );
    return null;
  }

  const welcomeSettings = canvasSettingsGlobal.welcome_image;
  // const fontSettings = canvasSettingsGlobal.font; // Già usato in ensureCustomFontsRegistered
  const dynamicColorInstance = new DynamicColor();
  const ColorFuncs = dynamicColorInstance.ColorFunctions ||
    DynamicColor.ColorFunctions || {
      ArrayToRgb: (arr) => `rgb(${arr.join(",")})`,
      rgbToHex: (r, g, b) =>
        `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`,
    };

  try {
    BotConsole.debug(
      `[WelcomeImg] Inizio generazione immagine per ${member.user.tag}.`
    );
    const canvas = createCanvas(welcomeSettings.width, welcomeSettings.height);
    const ctx = canvas.getContext("2d");
    // ... (resto della logica di generateWelcomeImage come te l'ho fornita precedentemente,
    //         utilizzando welcomeSettings e canvasSettingsGlobal.font per i nomi dei font) ...
    // Esempio per i font:
    const fontFamily1 = canvasSettingsGlobal.font.name[0].split(".")[0];
    const fontFamily2 = canvasSettingsGlobal.font.name[1]
      ? canvasSettingsGlobal.font.name[1].split(".")[0]
      : fontFamily1;

    // Assicurati che ogni riferimento a `canvasSettingsConfig` dentro `generateWelcomeImage`
    // sia sostituito con `canvasSettingsGlobal` se quella era la tua intenzione,
    // o che `canvasSettingsConfig` sia passato correttamente.
    // Nella mia ultima versione di generateWelcomeImage, passavo `canvasSettingsGlobal` come terzo argomento.
    // Lo manterrò così per chiarezza.

    const numColors = welcomeSettings.num_colors || 3;
    const avatarUrl = member.user.displayAvatarURL({
      extension: "png",
      size: 512,
    });

    await dynamicColorInstance.setImgUrl(avatarUrl);
    if (typeof dynamicColorInstance.setNumcolorextract === "function") {
      dynamicColorInstance.setNumcolorextract(numColors);
    }
    const palletAndText = await dynamicColorInstance.ReturnPalletandTextColor();

    if (
      !palletAndText ||
      !palletAndText.palette ||
      !palletAndText.textColor ||
      palletAndText.palette.length < numColors
    ) {
      BotConsole.warning(
        "[WelcomeImg] Fallita estrazione palette/textColor, uso colori di fallback per",
        member.user.tag
      );
      palletAndText.palette = [
        [80, 80, 120],
        [100, 100, 140],
        [120, 120, 160],
      ];
      palletAndText.textColor = [230, 230, 230];
    }

    const canvasGradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    palletAndText.palette.slice(0, numColors).forEach((colorArray, index) => {
      const rgbStr = ColorFuncs.ArrayToRgb(colorArray);
      canvasGradient.addColorStop(
        Math.max(0, Math.min(1, index / (numColors - 1 || 1))),
        rgbStr
      );
    });
    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    const radius = 60;
    const startX = 70;
    const startY = 70;
    const rectWidth = canvas.width - startX * 2;
    const rectHeight = canvas.height - startY * 2;
    ctx.beginPath();
    ctx.moveTo(startX + radius, startY);
    ctx.lineTo(startX + rectWidth - radius, startY);
    ctx.quadraticCurveTo(
      startX + rectWidth,
      startY,
      startX + rectWidth,
      startY + radius
    );
    ctx.lineTo(startX + rectWidth, startY + rectHeight - radius);
    ctx.quadraticCurveTo(
      startX + rectWidth,
      startY + rectHeight,
      startX + rectWidth - radius,
      startY + rectHeight
    );
    ctx.lineTo(startX + radius, startY + rectHeight);
    ctx.quadraticCurveTo(
      startX,
      startY + rectHeight,
      startX,
      startY + rectHeight - radius
    );
    ctx.lineTo(startX, startY + radius);
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    const avatarSize = welcomeSettings.avatarSize || 320;
    const avatarX = startX + 80;
    const avatarY = canvas.height / 2 - avatarSize / 2;
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.clip();
    const img = await loadImage(avatarUrl);
    ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    ctx.lineWidth = welcomeSettings.avatarBorderSize || 12;
    const textColorRgbStr = ColorFuncs.ArrayToRgb(palletAndText.textColor);
    ctx.strokeStyle = textColorRgbStr;
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.stroke();

    ctx.fillStyle = textColorRgbStr;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const textStartX = avatarX + avatarSize + 70;
    // const fontFamily1 = canvasSettingsGlobal.font.name[0].split(".")[0];
    // const fontFamily2 = canvasSettingsGlobal.font.name[1] ? canvasSettingsGlobal.font.name[1].split(".")[0] : fontFamily1;
    // Usa i font registrati, assicurati che i nomi famiglia siano corretti
    const registeredFontFamily1 =
      canvasSettingsGlobal.font.name[0].split(".")[0];
    const registeredFontFamily2 =
      canvasSettingsGlobal.font.name.length > 1
        ? canvasSettingsGlobal.font.name[1].split(".")[0]
        : registeredFontFamily1;

    ctx.font = `${
      welcomeSettings.welcomeTextSize || "90px"
    } "${registeredFontFamily1}"`;
    ctx.fillText("Benvenuto", textStartX, canvas.height * 0.3);

    const memberName = (
      member.user.globalName ||
      member.user.displayName ||
      member.user.username
    ).slice(0, 25);
    ctx.font = `${
      welcomeSettings.nameTextSize || "110px"
    } "${registeredFontFamily2}", "${registeredFontFamily1}"`;
    ctx.fillText(memberName, textStartX, canvas.height / 2);

    ctx.font = `${
      welcomeSettings.countTextSize || "60px"
    } "${registeredFontFamily1}"`;
    ctx.fillText(
      `${guildMemberCount}° membro del server!`,
      textStartX,
      canvas.height * 0.7
    );

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: `welcome-${member.id}.png`,
    });
    const embedColorHex = ColorFuncs.rgbToHex
      ? ColorFuncs.rgbToHex(
          palletAndText.textColor[0],
          palletAndText.textColor[1],
          palletAndText.textColor[2]
        )
      : `#${palletAndText.textColor
          .map((c) => c.toString(16).padStart(2, "0"))
          .join("")}`;

    BotConsole.info(
      `[WelcomeImg] Immagine di benvenuto generata per ${member.user.tag}`
    );
    return { attachment, embedColorHex };
  } catch (error) {
    BotConsole.error(
      "[WelcomeImg] Errore fatale generando immagine di benvenuto:",
      error
    );
    BotConsole.error(error); // Stampa lo stack trace per debug più approfondito
    return null;
  }
}
// ----- FINE SEZIONE HELPER IMMAGINE -----

export default {
  name: "NewMemberWelcomeAndRoleRestore",
  eventType: Events.GuildMemberAdd,
  isActive: true,

  async execute(member, client) {
    const guild = member.guild;
    const user = member.user;
    const guildLogPrefix = `[GuildMemberAdd - ${guild.name} (${guild.id})]`;
    const memberLogPrefix = `${guildLogPrefix} [Membro: ${user.tag} (${user.id})]`;

    BotConsole.info(`${memberLogPrefix} Si è unito al server.`);

    // Assicurati che la configurazione canvas sia caricata se non lo è già
    // Questo è un fallback, l'ideale è chiamare initializeWelcomeImageSystem() all'avvio del bot.
    if (!canvasSettingsGlobal) {
      initializeWelcomeImageSystem();
    }

    try {
      if (!SqlManager.pool) {
        BotConsole.warning(
          `${memberLogPrefix} SqlManager.pool non inizializzato. Tentativo di connessione...`
        );
        try {
          await SqlManager.connect(ConfigManager.getConfig("sql"));
          BotConsole.info(
            `${memberLogPrefix} Connessione a SqlManager stabilita al volo.`
          );
        } catch (connectErr) {
          BotConsole.error(
            `${memberLogPrefix} Fallita connessione a SqlManager al volo.`,
            connectErr
          );
          return;
        }
      }

      // ... (Logica di sincronizzazione utente, associazione gilda, ripristino ruoli - come prima) ...
      const memberGlobalName =
        user.globalName || member.displayName || user.username;
      await SqlManager.synchronizeGlobalMember({
        id: user.id,
        globalName: memberGlobalName,
      });
      await SqlManager.ensureGuildMemberAssociation(guild.id, user.id);
      BotConsole.debug(
        `${memberLogPrefix} Sincronizzazione utente e associazione gilda OK.`
      );

      const guildConfig = await SqlManager.getGuildById(guild.id);
      if (!guildConfig) {
        BotConsole.warning(
          `${memberLogPrefix} Nessuna configurazione DB per la gilda.`
        );
        return;
      }

      let rolesActuallyRestored = false;
      if (!user.bot) {
        BotConsole.info(`${memberLogPrefix} Controllo ruoli precedenti...`);
        const allPreviousRolesInDb = await SqlManager.getRolesOfMember(user.id);
        const previousRolesInThisGuildFromDb = allPreviousRolesInDb.filter(
          (roleRecord) => roleRecord.IDGUILD === guild.id
        );

        if (previousRolesInThisGuildFromDb.length > 0) {
          BotConsole.info(
            `${memberLogPrefix} Trovati ${previousRolesInThisGuildFromDb.length} ruoli DB per questa gilda.`
          );
          const rolesToAttemptReassign = [];
          for (const roleRecord of previousRolesInThisGuildFromDb) {
            const discordRole = guild.roles.cache.get(roleRecord.ID);
            if (discordRole) rolesToAttemptReassign.push(discordRole);
            else
              BotConsole.warning(
                `${memberLogPrefix} Ruolo DB ${roleRecord.NOME} (${roleRecord.ID}) non trovato su Discord.`
              );
          }

          if (rolesToAttemptReassign.length > 0) {
            const botMember = await guild.members.fetchMe();
            if (
              !botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)
            ) {
              BotConsole.warning(
                `${memberLogPrefix} Bot non ha 'ManageRoles' per ripristino.`
              );
            } else {
              let restoredCount = 0;
              for (const role of rolesToAttemptReassign) {
                if (botMember.roles.highest.comparePositionTo(role) > 0) {
                  try {
                    await member.roles.add(
                      role,
                      "Ripristino ruoli precedenti al rientro."
                    );
                    restoredCount++;
                  } catch (reErr) {
                    BotConsole.error(
                      `${memberLogPrefix} Errore riassegnando ${role.name}:`,
                      reErr.message
                    );
                  }
                } else
                  BotConsole.warning(
                    `${memberLogPrefix} Bot non può riassegnare ${role.name} (gerarchia).`
                  );
              }
              if (restoredCount > 0) {
                rolesActuallyRestored = true;
                BotConsole.info(
                  `${memberLogPrefix} ${restoredCount} ruoli ripristinati.`
                );
                try {
                  const restoredRoleNames = rolesToAttemptReassign
                    .slice(0, restoredCount)
                    .map((r) => `\`${r.name}\``)
                    .join(", ");
                  const dmEmbed = await new PresetEmbed({ guild, member }).init(
                    false
                  );
                  dmEmbed.KInfo(
                    "Ruoli Ripristinati",
                    `Bentornato/a su **${guild.name}**! Alcuni dei tuoi ruoli precedenti sono stati ripristinati:\n${restoredRoleNames}`
                  );
                  await member.send({ embeds: [dmEmbed] }).catch(() => {
                    /* ignora errore dm */
                  });
                } catch (e) {
                  BotConsole.warning(
                    `${memberLogPrefix} Errore invio DM per ruoli ripristinati.`
                  );
                }
              }
            }
          }
        } else
          BotConsole.info(
            `${memberLogPrefix} Nessun ruolo precedente trovato.`
          );
      } else
        BotConsole.info(`${memberLogPrefix} È un bot, salto ripristino ruoli.`);

      // Messaggio di Benvenuto (con Immagine Canvas o Embed Semplice)
      if (guildConfig.WELCOME_ID) {
        const welcomeChannel = await guild.channels
          .fetch(guildConfig.WELCOME_ID)
          .catch(() => null);
        if (
          welcomeChannel &&
          welcomeChannel.isTextBased() &&
          welcomeChannel.viewable
        ) {
          const botPerms = welcomeChannel.permissionsFor(client.user);
          if (
            botPerms &&
            botPerms.has(PermissionsBitField.Flags.SendMessages) &&
            botPerms.has(PermissionsBitField.Flags.EmbedLinks) &&
            botPerms.has(PermissionsBitField.Flags.AttachFiles)
          ) {
            // Passa canvasSettingsGlobal a generateWelcomeImage
            const welcomeImageResult = await generateWelcomeImage(
              member,
              guild.memberCount,
              canvasSettingsGlobal
            );
            const welcomeEmbed = await new PresetEmbed({ guild, member }).init(
              false
            );

            if (welcomeImageResult && welcomeImageResult.attachment) {
              welcomeEmbed
                .setTitle(`👋 Benvenuto/a, ${member.displayName}!`)
                .setDescription(
                  `🎉 **${user.tag}** è appena atterrato/a su **${guild.name}**!\nSiamo ora ${guild.memberCount} membri!`
                )
                .setImage(`attachment://${welcomeImageResult.attachment.name}`)
                .setColor(
                  welcomeImageResult.embedColor || PresetEmbed.DEFAULT_COLOR
                );

              await welcomeChannel.send({
                embeds: [welcomeEmbed],
                files: [welcomeImageResult.attachment],
              });
              BotConsole.success(
                `${memberLogPrefix} Messaggio di benvenuto con immagine inviato.`
              );
            } else {
              BotConsole.warning(
                `${memberLogPrefix} Fallita generazione immagine benvenuto, invio embed semplice.`
              );
              welcomeEmbed.KSuccess(
                `Benvenuto/a ${member.displayName}!`,
                `Ciao ${user}, un caloroso benvenuto su **${guild.name}**! 🎉\nSiamo felici di averti con noi.`
              );
              welcomeEmbed.setThumbnail(
                user.displayAvatarURL({ dynamic: true, size: 256 })
              );
              welcomeEmbed.addFields({
                name: "Membri Totali",
                value: `${guild.memberCount}`,
                inline: true,
              });
              await welcomeChannel.send({ embeds: [welcomeEmbed] });
              BotConsole.success(
                `${memberLogPrefix} Messaggio di benvenuto (embed semplice) inviato.`
              );
            }
          } else
            BotConsole.warning(
              `${memberLogPrefix} Bot non ha permessi SendMessages/EmbedLinks/AttachFiles nel canale benvenuto ${welcomeChannel.name}.`
            );
        } else if (guildConfig.WELCOME_ID)
          BotConsole.warning(
            `${memberLogPrefix} Canale benvenuto ${guildConfig.WELCOME_ID} non trovato o non testuale/visibile.`
          );
      } else
        BotConsole.info(
          `${memberLogPrefix} Nessun canale benvenuto configurato.`
        );

      // Assegna Ruolo di Default (se non sono stati ripristinati ruoli specifici per l'utente)
      if (!user.bot && !rolesActuallyRestored) {
        if (guildConfig.ROLEDEFAULT_ID) {
          const roleToAssignId = guildConfig.ROLEDEFAULT_ID;
          const roleTypeDescription = "utente di default";
          const role = guild.roles.cache.get(roleToAssignId);
          if (role) {
            const botMember = await guild.members.fetchMe();
            if (
              !botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)
            ) {
              BotConsole.warning(
                `${memberLogPrefix} Bot non ha 'ManageRoles' per ruolo default utente.`
              );
            } else if (botMember.roles.highest.comparePositionTo(role) <= 0) {
              BotConsole.warning(
                `${memberLogPrefix} Bot non può assegnare ruolo default utente "${role.name}" (gerarchia).`
              );
            } else {
              try {
                await member.roles.add(
                  role,
                  `Ruolo default utente all'ingresso.`
                );
                BotConsole.success(
                  `${memberLogPrefix} Assegnato ruolo "${role.name}" (${roleTypeDescription}).`
                );
              } catch (roleErr) {
                BotConsole.error(
                  `${memberLogPrefix} Errore assegnando ruolo default utente:`,
                  roleErr.message
                );
              }
            }
          } else
            BotConsole.warning(
              `${memberLogPrefix} Ruolo default utente ${roleToAssignId} non trovato.`
            );
        } else
          BotConsole.info(
            `${memberLogPrefix} Nessun ruolo default UTENTE configurato.`
          );
      } else if (user.bot) {
        if (guildConfig.ROLEBOTDEFAULT_ID) {
          const roleToAssignId = guildConfig.ROLEBOTDEFAULT_ID;
          const roleTypeDescription = "bot di default";
          const role = guild.roles.cache.get(roleToAssignId);
          if (role) {
            const botMember = await guild.members.fetchMe();
            if (
              !botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)
            ) {
              BotConsole.warning(
                `${memberLogPrefix} Bot non ha 'ManageRoles' per ruolo default bot.`
              );
            } else if (botMember.roles.highest.comparePositionTo(role) <= 0) {
              BotConsole.warning(
                `${memberLogPrefix} Bot non può assegnare ruolo default bot "${role.name}" (gerarchia).`
              );
            } else {
              try {
                await member.roles.add(role, `Ruolo default bot all'ingresso.`);
                BotConsole.success(
                  `${memberLogPrefix} Assegnato ruolo "${role.name}" (${roleTypeDescription}).`
                );
              } catch (roleErr) {
                BotConsole.error(
                  `${memberLogPrefix} Errore assegnando ruolo default bot:`,
                  roleErr.message
                );
              }
            }
          } else
            BotConsole.warning(
              `${memberLogPrefix} Ruolo default bot ${roleToAssignId} non trovato.`
            );
        } else
          BotConsole.info(
            `${memberLogPrefix} Nessun ruolo default BOT configurato.`
          );
      } else if (rolesActuallyRestored) {
        BotConsole.info(
          `${memberLogPrefix} Ruoli precedenti ripristinati, salto ruolo default utente.`
        );
      }
    } catch (error) {
      BotConsole.error(
        `${memberLogPrefix} Errore generale durante l'evento guildMemberAdd:`
      );
      BotConsole.error(error);
    }
  },
};
