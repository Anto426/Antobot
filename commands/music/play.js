const cguild = require("./../../setting/guild.json")
const errmsg = require("./../../functions/msg/errormsg")
module.exports = {
    name: "play",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: false,
    test: false,

    data: {
        name: "play",
        description: "riproduci canzone",
        options: [{
            name: "song",
            description: "Link o nome della canzone",
            type: 3,
            required: true
        }]
    },
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return errmsg.vocalchannel(interaction)
        }

        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return errmsg.vocalchannel(interaction)
        }

        let song = interaction.options.getString("song")
        interaction.reply("loading...").catch({})

        await distube.play(voiceChannelBot || voiceChannel, song, {
            member: interaction.member,
            textChannel: interaction.channel,
            message: song.name
        })


    }
}