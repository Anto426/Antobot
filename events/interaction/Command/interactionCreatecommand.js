const { inspect } = require(`util`)
const { InteractionType } = require('discord.js');
const configs = require("./../../../index")
const errmsg = require("../../../function/msg/errormsg")
module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {

        try {
            if (interaction.type == InteractionType.ApplicationCommand) {
                let owner = false, sowner = false, staff = false, autorizza = true, autorizza1 = false;
                for (let id in configs.moderation.owner) {
                    console.log(id)
                    if (interaction.member.id == configs.moderation.owner[id]) { owner = true }
                }
                if (interaction.member.id == interaction.guild.ownerId) { sowner = true }

                for (let id in configs.moderation[interaction.guild.name].staff) {
                    console.log(id)
                    if (configs.moderation[interaction.guild.name].staff[id]) { staff = true }
                }
                const command = configs.client.commands.get(interaction.commandName)
                if (!command) return

                if (command.onlyOwner) {
                    if (!owner) {
                        autorizza = false
                        errmsg.notpermisionmsg(interaction)
                        return 0
                    }
                }
                if (command.onlyStaff) {
                    if (!owner || !sowner || !staff) {
                        autorizza = false
                        errmsg.notpermisionmsg(interaction)
                        return 0
                    }
                }


                const commandsFiles = configs.fs.readdirSync(`./commands/moderation/moderation/`);
                for (const file of commandsFiles) {
                    var commands2 = require(`./../../../commands/moderation/moderation/${file}`);
                    if (commands2.name == command.name && command.name != "unban") {
                        trovato = true
                        if (interaction.member.roles.highest.position > interaction.options.getMember("user").roles.highest.position) {
                            command.execute(interaction)
                            return

                        }
                    }
                }


                if (interaction.defaultchannel) {
                    if (interaction.channel.name == "「💻」comandi" || owner || sowner) {
                        if (autorizza) {
                            command.execute(interaction)
                            return 0
                        }
                    } else {
                        console.log("permesso negato")
                        errmsg.notpermisionmsg(interaction)
                        return 0
                    }
                } else {
                    command.execute(interaction)
                    return 0
                }
            }
        } catch (err) {
            console.log(err)
            errmsg.genericmsg(interaction)
        }
    }
}
