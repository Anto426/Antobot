const { EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const errmsg = require("./../../functions/msg/errormsg")
module.exports = {
    name: "repeat",
    permisions: [],
    allowedchannels: global.AllowCommands,
    position: false,
    test: false,
    data: {
        name: "repeat",
        description: "ripeti canzone",
        options: [{
            name: "mode",
            description: "mode",
            type: 3,
            required: true,
            choices: [{
                name: "off",
                value: "off"
            }, {
                name: "Song",
                value: "song"
            }, {
                name: "Queue",
                value: "queue"
            },]
        }]
    },
    execute(interaction) {
        let queue = distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return errmsg.vocalchannel(interaction)
        }

        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
           return errmsg.vocalchannel(interaction)
        }



        if (!queue) {
           return errmsg.listvoid(interaction)
        }
        let args = interaction.options.getString("mode")
        let mode = null

        switch (args) {
            case "off":
                mode = 0
                break;
            case "song":
                mode = 1
                break;
            case "queue":
                mode = 2
                break;

            default:
                break;
        }

        queue.setRepeatMode(mode)
        let embed = new EmbedBuilder()
            .setTitle("Repet Mode")
            .addFields([{ name: "Stato", value: `\`\`\`${mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : "off"}  \`\`\`` }])
            .setColor(cembed.color.Green)
            .setThumbnail(cembed.immage.load)
        return interaction.reply({ embeds: [embed] })


    }
}