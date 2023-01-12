const { EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "skip",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    data: {
        name: "skip",
        description: "skip list song",
    },
    execute(interaction) {
        let queue = distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Devi essere in un canale vocale")
                .setColor(cembed.color.Red)
                .setThumbnail(cembed.immage.err)
            return interaction.reply({ embeds: [embed] })
        }
        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot & !voiceChannel == voiceChannelBot) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Qualcuno sta ascoltando già della musica")
                .setColor(cembed.color.Red)
                .setThumbnail(cembed.immage.err)
            return interaction.reply({ embeds: [embed] })
        }
        try {
            distube.skip(interaction)
                .catch(() => {
                    let embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Nessuna canzone in coda")
                        .setColor(cembed.color.Red)
                        .setThumbnail(cembed.immage.err)
                    return interaction.reply({ embeds: [embed] })
                })
        } catch {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Nessuna canzone in coda")
                .setColor(cembed.color.Red)
                .setThumbnail(cembed.immage.err)
            return interaction.reply({ embeds: [embed] })
        }
        let embed = new EmbedBuilder()
            .setTitle("Song skipped")
            .setThumbnail(cembed.immage.load)
            .setColor(cembed.color.Green)
        interaction.reply({ embeds: [embed] })
    }
}