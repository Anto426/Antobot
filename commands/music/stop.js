const { EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "stop",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    data: {
        name: "stop",
        description: "stop list song",
    },
    execute(interaction) {
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
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Devi essere in un canale vocale")
                .setColor(cembed.color.Red)
                .setThumbnail(cembed.immage.err)
            return interaction.reply({ embeds: [embed] })
        }

        try {
            distube.stop(interaction)
                .catch(() => {
                    let embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Nessun brano è in riproduzione")
                        .setColor(cembed.color.Red)
                        .setThumbnail(cembed.immage.err)
                    return interaction.reply({ embeds: [embed] })
                })
        } catch {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Nessun brano è in riproduzione")
                .setColor(cembed.color.Red)
                .setThumbnail(cembed.immage.err)
            return interaction.reply({ embeds: [embed] })
        }

        let embed = new EmbedBuilder()
            .setTitle("Riproduzione interrotta")
            .setDescription("Tutti i brani in coda verranno cancellati è il bot si disconnetterà")
            .setColor(cembed.color.Green)
            .setThumbnail(cembed.immage.load)
        return interaction.reply({ embeds: [embed] })

    }
}