let functions = require("./../../function/roomandticket/function")
module.exports = {
    name: "cdelete",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "cdelete",
        description: "Elimina stanza privata"
    },
    execute(interaction) {

        let file = `./Database/${interaction.guild.name}/room.json`
        let content = fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        let trovata = false
        parseJson.list.forEach((x) => {
            if (x.name == interaction.member.user.tag) { trovata = true }
        })

        if (!trovata) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Ops!  Non hai una stanza privata creala una <#948323558369669130>")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }

        functions.remove(interaction, "room")

        let embed = new Discord.EmbedBuilder()
            .setTitle("Stanza cancellata")
            .setDescription(`Stanza cancellata con succeso per ricrearla vai in  <#948323558369669130>`)
            .setThumbnail(configs.embed.images.succes)
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })

    }
}