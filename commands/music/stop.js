const { EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const errmsg = require("./../../functions/msg/errormsg")
module.exports = {
    name: "stop",
    permisions: [],
    allowedchannels: global.AllowCommands,
    position: false,
    test: false,
    data: {
        name: "stop",
        description: "Stoppa la musica",
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
            return errmsg.vocalchannel(interaction)
        }

        try {
            distube.stop(interaction)
                .catch(() => {
                    return errmsg.vocalchannel(interaction)
                })
        } catch {
            return errmsg.listvoid(interaction)
        }

        let embed = new EmbedBuilder()
            .setTitle("Riproduzione interrotta")
            .setDescription("Tutti i brani in coda verranno cancellati è il bot si disconnetterà")
            .setColor(cembed.color.Green)
            .setThumbnail(cembed.immage.load)
        return interaction.reply({ embeds: [embed] })

    }
}