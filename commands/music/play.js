const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: "play",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    data: {
        name: "play",
        description: "play song",
        options: [{
            name: "song",
            description: "Link o nome della canzone",
            type: 6,
            required: true
        }]
    },
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Devi essere in un canale vocale")
                .setColor(configs.embed.color.red)
                .setThumbnail(configs.embed.images.error)
            return interaction.reply({ embeds: [embed] })
        }

        const voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Devi essere in un canale vocale")
                .setColor(configs.embed.color.red)
                .setThumbnail(configs.embed.images.error)
            return interaction.reply({ embeds: [embed] })
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