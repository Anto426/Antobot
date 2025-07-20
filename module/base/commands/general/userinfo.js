import { ApplicationCommandOptionType } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "userinfo",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "userinfo",
    description: "Mostra informazioni sull'utente",
    options: [
      {
        name: "utente",
        description: "L'utente di cui vuoi vedere le informazioni",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    const user = interaction.options?.getUser("utente") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    await user.fetch();

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: user.displayAvatarURL({ format: "png", size: 512 }),
    }).init();

    const roles = member?.roles.cache
      .filter((role) => role.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString());

    let roleDisplay = "Nessun ruolo specifico.";
    if (roles && roles.length > 0) {
      const maxRolesToShow = 8;
      const displayedRoles = roles.slice(0, maxRolesToShow);
      roleDisplay = displayedRoles.join(" ");
      if (roles.length > maxRolesToShow) {
        roleDisplay += ` **e altri ${roles.length - maxRolesToShow}...**`;
      }
    }

    embed
      .setTitle(`👤 Profilo di ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        {
          name: "Identità",
          value: `<@${user.id}>\n\`${user.id}\``,
          inline: true,
        },
        {
          name: "Stato",
          value: `\`${member?.presence?.status ?? "offline"}\``,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },

        {
          name: "Account Creato",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Entrato nel Server",
          value: member
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
            : "N/A",
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },

        {
          name: `Ruoli [${roles?.length ?? 0}]`,
          value: roleDisplay,
          inline: false,
        }
      );

    if (user.banner) {
      embed.setImage(user.bannerURL({ dynamic: true, size: 512 }));
    }

    return { embeds: [embed] };
  },
};
