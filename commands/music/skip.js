const { EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const errmsg = require("./../../functions/msg/errormsg")
module.exports = {
    name: "skip",
    permisions: [],
    allowedchannels: global.AllowCommands,
    position: false,
    test: false,
    data: {
        name: "skip",
        description: "skip canzone",
    },
    execute(interaction) {
        let queue = distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return errmsg.vocalchannel(interaction)
        }
        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot & !voiceChannel == voiceChannelBot) {
            return errmsg.vocalchannel(interaction)
        }
        try {
            distube.skip(interaction)
                .catch(() => {
                    return errmsg.listvoid(interaction)
                })
        } catch {
            return errmsg.listvoid(interaction)
        }
        let embed = new EmbedBuilder()
            .setTitle("Song skipped")
            .setThumbnail(cembed.immage.load)
            .setColor(cembed.color.Green)
        interaction.reply({ embeds: [embed] })
    }
}