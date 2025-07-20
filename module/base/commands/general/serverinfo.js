import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "serverinfo",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "serverinfo",
    description: "Mostra informazioni sul server",
  },
  execute: async (interaction) => {
    const guild = interaction.guild;

    const embed = await new PresetEmbed({
      guild,
      member: interaction.member,
      image: guild.iconURL({ format: "png", size: 512 }),
    }).init();

    const owner = await guild.fetchOwner();
    const links = [];
    if (guild.vanityURLCode) {
      links.push(`[Invito Vanity](https://discord.gg/${guild.vanityURLCode})`);
    }
    if (guild.bannerURL()) {
      links.push(`[Banner](${guild.bannerURL({ size: 1024 })})`);
    }

    embed
      .setTitle(`✨ Informazioni su ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "👑 Proprietario", value: owner.toString(), inline: true },
        {
          name: "📅 Creazione",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
          inline: true,
        },
        { name: "🆔 ID Server", value: `\`${guild.id}\``, inline: true },

        {
          name: "👥 Membri",
          value: `\`${guild.memberCount.toLocaleString("it-IT")}\``,
          inline: true,
        },
        {
          name: "🎭 Ruoli",
          value: `\`${guild.roles.cache.size}\``,
          inline: true,
        },
        {
          name: "📁 Canali",
          value: `\`${guild.channels.cache.size}\``,
          inline: true,
        },

        {
          name: "🚀 Livello Boost",
          value: `Livello ${guild.premiumTier}`,
          inline: true,
        },
        {
          name: "✨ Boost Totali",
          value: `\`${guild.premiumSubscriptionCount ?? 0}\``,
          inline: true,
        },
        {
          name: "🔒 Verifica",
          value: `Livello ${guild.verificationLevel}`,
          inline: true,
        }
      );

    if (guild.description) {
      embed.setDescription(
        `**Descrizione del server:**\n*${guild.description}*`
      );
    }

    if (links.length > 0) {
      embed.addFields({
        name: "🔗 Link Utili",
        value: links.join(" • "),
        inline: false,
      });
    }

    if (guild.bannerURL()) {
      embed.setImage(guild.bannerURL({ size: 512 }));
    }

    return { embeds: [embed] };
  },
};
