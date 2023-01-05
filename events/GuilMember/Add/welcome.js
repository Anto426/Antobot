const Discord = require('discord.js')
const cembed = require("./../../../setting/embed.json")
const cguild = require("./../../../setting/guild.json")
module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const embed = new Discord.EmbedBuilder()
            .setTitle(`Welcome`)
            .setDescription(`${member} Welcome to ${member.guild.name}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color["Gold Fusion"])

        member.guild.channels.cache.get(cguild['Anto\'s  Server'].channel.serverinfo.welcome).send({ embeds: [embed] })
        member.roles.add(member.guild.roles.cache.get(cguild['Anto\'s  Server'].role.user))

    }
}
