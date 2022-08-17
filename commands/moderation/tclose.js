
const { PermissionsBitField } = require('discord.js')
const configs = require("./../../index")
module.exports = {
    name: "tclose",
    permision: [],
    onlyStaff : true,
    onlyOwner: false,
    data: {
        name: "tclose",
        description: "chiude i ticket"
    },
    execute(interaction) {

        let temp = []
        let file = `./Database/${interaction.guild.name}/ticket.json`
        let content = configs.fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        parseJson.list.forEach((x) => {
            if (x.iduser != interaction.channel.topic) {
                temp.push(x)
            } else {
                for (y in x) {
                    trovata = true
                    console.log(y)
                    if (y != "iduser") {

                        let channel = interaction.guild.channels.cache.get(x[y])
                        try {
                            channel.delete()
                        } catch (err) { console.log(err) }
                    }
                }


            }
        })
        parseJson.list = temp
        configs.fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })



    }
}