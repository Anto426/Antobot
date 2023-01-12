const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: "repeat",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    data: {
        name: "repeat",
        description: "repeat song",
        options: [{
            name: "mode",
            description: "Link o nome della canzone",
            type: 6,
            required: true,
            choices: [{
                name: "off",
                value: "Off"
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



        if (!queue) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("La lista delle canzoni è vuota!")
                .setColor(configs.embed.color.red)
                .setThumbnail(configs.embed.images.error)
            return interaction.reply({ embeds: [embed] })
        }
        let args = interaction.options.getString("mode")
        let mode = null

        if (!args[1]) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Devi specificare cosa devo ripetere!")
                .setColor(configs.embed.color.red)
                .setThumbnail(configs.embed.images.error)
            return interaction.reply({ embeds: [embed] })
        }

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
            .addField("Stato", `\`\`\`${mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : "off"}  \`\`\``)
            .setColor(configs.embed.color.green)
            .setThumbnail(configs.embed.images.succes)
        return interaction.reply({ embeds: [embed] })


    }
}