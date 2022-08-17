/*const check = require("./../../../function/check/check")
const jsonf = require("./../../../function/json/jsnonfunctions")
const { InteractionType } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.isSelectMenu()) {
            if (interaction.type != InteractionType.ApplicationCommand) {

                let roletemp = {}
                roletemp.role = {}
                roletemp.role.staff = {}


                interaction.guild.roles.cache.forEach(x => {
                    let check2 = interaction.values.find(y => y == x.id)
                    if (!check2) {
                        roletemp.role[x.name] = x.id

                    } else {


                        roletemp.role.staff[x.name] = x.id

                    }
                });
                console.log(roletemp)
                check.dircheck("./Database", interaction.guild.name)
                if (check.filecheck(`./Database/${interaction.guild.name}/role.json`)) {
                    jsonf.jwrite(`./Database/${interaction.guild.name}/role.json`, roletemp)


                }
            }
        }
    }
}*/