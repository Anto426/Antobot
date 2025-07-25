import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/services/SqlManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import { Events, PermissionsBitField, MessageType } from "discord.js";

export default {
  name: "BoostManager",
  eventType: Events.MessageCreate,
  isActive: true,

  async execute(message) {
    if (!message.guild || !this.#isBoostMessage(message)) {
      return;
    }

    const { guild, author: user } = message;
    const logPrefix = `[BoostManager - ${guild.name}][${user.tag}]`;

    const member = await guild.members.fetch(user.id).catch(() => {
      BotConsole.warning(
        `${logPrefix} Impossibile recuperare l'oggetto GuildMember per l'utente che ha boostato.`
      );
      return null;
    });

    if (!member) return;

    BotConsole.info(
      `${logPrefix} ha potenziato il server (rilevato da messaggio di sistema).`
    );
    await this.#sendBoostThankYouMessage(member, logPrefix);
  },

  isBoostMessage(message) {
    return [
      MessageType.UserPremiumGuildSubscription,
      MessageType.UserPremiumGuildSubscriptionTier1,
      MessageType.UserPremiumGuildSubscriptionTier2,
      MessageType.UserPremiumGuildSubscriptionTier3,
    ].includes(message.type);
  },

  async sendBoostThankYouMessage(member, logPrefix) {
    const { guild } = member;
    const guildConfig = await SqlManager.getGuildById(guild.id);

    // Controlla se il canale per i boost è configurato
    if (!guildConfig?.BOOST_CH_ID) {
      BotConsole.info(
        `${logPrefix} Canale per i boost non configurato. Nessun messaggio inviato.`
      );
      return;
    }

    const channel = await this.#getBoostChannel(
      guild,
      guildConfig.BOOST_CH_ID,
      logPrefix
    );
    if (!channel) return;

    const boostEmbed = new PresetEmbed({ guild, member });
    await boostEmbed.init(false);

    const totalBoosts = guild.premiumSubscriptionCount;
    const description = `Grazie mille a ${member} per aver potenziato il server! Il tuo supporto è preziosissimo! ❤️\n\nGrazie a te, il server ha ora **${totalBoosts}** potenziamenti!`;

    boostEmbed
      .setTitle("🚀 Nuovo Boost Ricevuto!")
      .setDescription(description)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setColor("#f47fff");

    try {
      await channel.send({ embeds: [boostEmbed] });
      BotConsole.success(
        `${logPrefix} Messaggio di ringraziamento per il boost inviato.`
      );
    } catch (error) {
      BotConsole.error(
        `${logPrefix} Impossibile inviare il messaggio di ringraziamento.`,
        error
      );
    }
  },

  async getBoostChannel(guild, channelId, logPrefix) {
    const channel = await guild.channels.fetch(channelId).catch(() => null);

    const requiredPerms = [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks,
    ];

    if (
      !channel?.isTextBased() ||
      !channel.permissionsFor(guild.members.me).has(requiredPerms)
    ) {
      BotConsole.warning(
        `${logPrefix} Canale per i boost (${channelId}) non valido o permessi mancanti.`
      );
      return null;
    }

    return channel;
  },
};
