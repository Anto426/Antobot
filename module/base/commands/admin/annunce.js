import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../../class/services/SqlManager.js";
import BotConsole from "../../../../class/console/BotConsole.js";
import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";

async function sendAnnouncementToGuild(
  guild,
  title,
  message,
  imageUrl,
  thumbnailUrl,
  commandIssuer
) {
  const logPrefix = `[Announce - ${guild.name}]`;
  try {
    const guildConfig = await SqlManager.getGuildById(guild.id);
    if (!guildConfig?.ANNOUNCEMENT_CH_ID) {
      BotConsole.info(`${logPrefix} Canale annunci non configurato. Salto.`);
      return false;
    }

    const channel = await guild.channels
      .fetch(guildConfig.ANNOUNCEMENT_CH_ID)
      .catch(() => null);
    if (!channel) {
      BotConsole.warning(
        `${logPrefix} Canale annunci (${guildConfig.ANNOUNCEMENT_CH_ID}) non trovato.`
      );
      return false;
    }

    const botMember = guild.members.me;
    const requiredPerms = [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks,
    ];
    if (!channel.permissionsFor(botMember).has(requiredPerms)) {
      BotConsole.warning(
        `${logPrefix} Permessi mancanti nel canale annunci (${channel.name}).`
      );
      return false;
    }

    const colorSourceUrl =
      imageUrl || thumbnailUrl
        ? commandIssuer.user.displayAvatarURL({ format: "png", size: 128 }) // Colore dal profilo utente
        : client.user.displayAvatarURL({ format: "png", size: 128 }); // Colore dal profilo bot

    const announcementEmbed = new PresetEmbed({
      guild,
      member: commandIssuer,
      image: colorSourceUrl,
    });

    await announcementEmbed.init(true);

    announcementEmbed
      .setTitle(title || "📢 Annuncio Importante")
      .setDescription(message)
      .setTimestamp();

    if (imageUrl) announcementEmbed.setImage(imageUrl);
    if (thumbnailUrl) announcementEmbed.setThumbnail(thumbnailUrl);

    await channel.send({ embeds: [announcementEmbed] });
    BotConsole.success(`${logPrefix} Annuncio inviato con successo.`);
    return true;
  } catch (error) {
    BotConsole.error(
      `${logPrefix} Errore durante l'invio dell'annuncio.`,
      error
    );
    return false;
  }
}

export default {
  name: "announce",
  permissions: [],
  isActive: true,
  isBotAllowed: false,
  isOwnerOnly: true, 
  data: {
    name: "announce",
    description: "Invia un annuncio a uno o a tutti i server.",
    options: [
      {
        name: "messaggio",
        type: ApplicationCommandOptionType.String,
        description: "Il contenuto dell'annuncio.",
        required: true,
      },
      {
        name: "globale",
        type: ApplicationCommandOptionType.Boolean,
        description: "Invia a tutti i server (True) o solo a questo (False).",
        required: true,
      },
      {
        name: "titolo",
        type: ApplicationCommandOptionType.String,
        description: "Il titolo dell'annuncio (opzionale).",
        required: false,
      },
      {
        name: "immagine",
        type: ApplicationCommandOptionType.String,
        description: "URL dell'immagine da includere nell'annuncio.",
        required: false,
      },
      {
        name: "thumbnail",
        type: ApplicationCommandOptionType.String,
        description: "URL della thumbnail da includere nell'annuncio.",
        required: false,
      },
    ],
  },
  execute: async (interaction) => {

    const message = interaction.options.getString("messaggio");
    const isGlobal = interaction.options.getBoolean("globale");
    const title = interaction.options.getString("titolo");
    const imageUrl = interaction.options.getString("immagine");
    const thumbnailUrl = interaction.options.getString("thumbnail");
    const commandIssuer = interaction.member;

    const summaryEmbed = new PresetEmbed({ member: commandIssuer });
    await summaryEmbed.init();

    if (isGlobal) {
      summaryEmbed.setTitle("📢 Invio Annuncio Globale");
      BotConsole.info(
        `[Announce] Avvio invio globale richiesto da ${interaction.user.tag}.`
      );

      const guilds = Array.from(client.guilds.cache.values());
      let successCount = 0;
      let failureCount = 0;

      const results = await Promise.all(
        guilds.map((guild) =>
          sendAnnouncementToGuild(
            guild,
            title,
            message,
            imageUrl,
            thumbnailUrl,
            commandIssuer
          )
        )
      );

      results.forEach((success) => {
        if (success) successCount++;
        else failureCount++;
      });

      summaryEmbed
        .KInfo(
          "Operazione Completata",
          "L'invio degli annunci a tutti i server è terminato."
        )
        .addFields(
          { name: "✅ Successi", value: `${successCount}`, inline: true },
          { name: "❌ Fallimenti", value: `${failureCount}`, inline: true }
        );
    } else {
      summaryEmbed.setTitle("📢 Invio Annuncio Locale");
      const guild = interaction.guild;

      const success = await sendAnnouncementToGuild(
        guild,
        title,
        message,
        imageUrl,
        thumbnailUrl,
        commandIssuer
      );
      if (success) {
        summaryEmbed.KSuccess(
          "Annuncio Inviato",
          `L'annuncio è stato inviato con successo al server **${guild.name}**.`
        );
      } else {
        summaryEmbed.KWarning(
          "Invio Fallito",
          `Non è stato possibile inviare l'annuncio. Controlla che il canale annunci sia configurato correttamente per questo server.`
        );
      }
    }

    return { embeds: [summaryEmbed], ephemeral: true};
  },
};
