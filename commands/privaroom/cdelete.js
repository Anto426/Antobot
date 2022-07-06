let functions = require("./../../function/globalfunction")
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
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription("Ops!  Non hai una stanza privata da rinominare creala una <#948323558369669130>")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }

        functions.remove(interaction, "room")

        let embed = new Discord.MessageEmbed()
            .setTitle("Stanza cancellata")
            .setDescription(`Stanza cancellata con succeso per ricrearla vai in  <#948323558369669130>`)
            .setThumbnail(configs.embed.images.succes)
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })

    }
}