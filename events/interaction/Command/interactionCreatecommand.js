const { inspect } = require(`util`)
const { InteractionType } = require('discord.js');
const configs = require("./../../../index")
const errmsg = require("./../../../function/error/errormsg")
module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {

        if (interaction.type == InteractionType.ApplicationCommand) {
            try {
                let owner = false
                for (let id in configs.owner) {
                    if (interaction.member.id == configs.owner[id]) { owner = true }
                }
                let sowner = false
                if (interaction.member.id == interaction.guild.ownerId) { sowner = true }

                try {
                    var staf = false
                    for (let role in configs.settings[interaction.guild.name].role.staff) {
                        if (interaction.member.roles.cache.has(configs.settings[interaction.guild.name].role.staff[role])) { staf = true }
                    }
                    for (let id in configs.owner) {
                        if (interaction.member.id == configs.owner[id]) { staf = true }
                    }
                } catch { }
                const command = configs.client.commands.get(interaction.commandName)
                if (!command) return

                const commandsFiles = configs.fs.readdirSync(`commands/bot`);
                for (const file of commandsFiles) {
                    const commands2 = require(`./../../../commands/bot/${file}`);
                    if (commands2.name == command.name && owner) {
                        command.execute(interaction)
                        return
                    }
                }

                if (configs.stato) {
                    if (command.onlyStaff) {



                        if (staf || owner || sowner) {
                            let trovato = false
                            let trovato2 = false
                            console.log("permesso accordato")
                            const commandsFiles = configs.fs.readdirSync(`./commands/moderation/moderation/`);
                            for (const file of commandsFiles) {
                                var commands2 = require(`./../../../commands/moderation/moderation/${file}`);
                                if (commands2.name == command.name && command.name != "unban") {
                                    trovato = true
                                    if (interaction.member.roles.highest.position > interaction.options.getMember("user").roles.highest.position) {
                                        trovato2 = true
                                        command.execute(interaction)
                                    }
                                }
                            }

                            if (!trovato) {
                                command.execute(interaction)
                            }

                            if (!trovato2) {

                                errmsg.notpermisionmsg(interaction)
                            }

                            return

                        } else {

                            console.log("permesso negato")
                            errmsg.notpermisionmsg(interaction)

                            return
                        }
                    }

                    if (command.onlyOwner) {

                        if (owner || sowner) {

                            console.log("permesso accordato")
                            command.execute(interaction)
                            return

                        } else {
                            errmsg.notpermisionmsg(interaction)

                            return
                        }



                    }
                }
                const commandsFiles2 = configs.fs.readdirSync(`./commands/privaroom/`);
                for (const file of commandsFiles2) {
                    const commands2 = require(`./../../../commands/privaroom/${file}`);
                    if (commands2.name == command.name) {
                        if (interaction.channel.name == interaction.member.user.tag || interaction.channel.topic == interaction.member.user.tag) {
                            command.execute(interaction)
                            return
                        }
                    }

                    if (interaction.channel.name == "「💻」comandi" || owner || sowner) {
                        command.execute(interaction)
                        return
                    } else {
                        console.log("permesso negato")
                        errmsg.notpermisionmsg(interaction)
                        return
                    }


                }


            } catch (err) {
                console.error(err)
                errmsg.message(interaction)
            }
        }
    }

}