const jsonf = require("../../../function/json/jsnonfunctions")
const check = require("../../../function/check/check")
const configs = require("../../../index")
const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {

            if (interaction.customId == "opentiket") {

                let file = `./Database/${interaction.guild.name}/ticket.json`
                let check2 = check.filecheck(file)
                if (check2.Promise) {
                    let content = jsonf.jread(file)
                } else {
                    let content = {list:[]}
                    content.list.push({[interaction.member.id]:"hi"})
                    jsonf.jwrite(file,content)
                }
            }

            if (interaction.customId == "closedtiket") { }

        }
    }

}