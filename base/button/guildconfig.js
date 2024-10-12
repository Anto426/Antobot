const { InitguildInfo } = require("../../function/interaction/button/initguild.js/initguildInfo")
const { initguildpagebuilder } = require("../../function/interaction/button/initguild.js/initguildpagebuilder")
const setting = require("../../setting/settings.json")

module.exports = {
    name: "initguild",
    description: "Gestisce i bottoni di initguild",
    execute(interaction, interactioncustomId) {
        let guildconfigbuilder = new initguildpagebuilder()
        let initguild = new InitguildInfo()
        let root = process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig


        if (interactioncustomId[4] === "r") {
            initguild.reset(interaction.guild, root).then(() => {
            }).catch(() => { })
        }

        if (interactioncustomId[2] === "0") {
            if (interaction.values) {
                initguild.SavedAllowChannel(root, interaction.values, interaction.guild.id).catch(() => { })
            }
            guildconfigbuilder.channelAllowpage(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                })
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "1") {

            if (interaction.values) {
                let channel = interaction.guild.channels.cache.get(interaction.values[0])
                initguild.singleChannel(channel, root, "rule").catch(() => { })
            }
            guildconfigbuilder.channelRule(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch(() => { })

        } else if (interactioncustomId[2] === "2") {
            if (interaction.values) {
                let channel = interaction.guild.channels.cache.get(interaction.values[0])
                initguild.singleChannel(channel, root, "welcome").catch(() => { })
            }
            guildconfigbuilder.ChannelWelcome(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch(() => { })
        } else if (interactioncustomId[2] === "3") {
            if (interaction.values) {
                let channel = interaction.guild.channels.cache.get(interaction.values[0])
                initguild.singleChannel(channel, root, "events").then(() => {
                }).catch(() => { })
            }
            guildconfigbuilder.ChannelEvent(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch(() => { })
        } else if (interactioncustomId[2] === "4") {
            if (interaction.values) {
                let channel = interaction.guild.channels.cache.get(interaction.values[0])
                initguild.singleChannel(channel, root, "boost").catch(() => { })
            }
            guildconfigbuilder.ChannelBoost(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch(() => { })

        } else if (interactioncustomId[2] === "5") {
            if (interaction.values) {
                let channel = interaction.guild.channels.cache.get(interaction.values[0])
                initguild.singleChannel(channel, root, "log").catch(() => { })
            }
            guildconfigbuilder.Channellog(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "6") {
            if (interaction.values) {
                initguild.SavedRole(root, interaction.values[0], interaction.guild.id, "roledefault").catch(() => { })
            }
            guildconfigbuilder.roleDefault(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "7") {
            if (interaction.values) {
                initguild.SavedRole(root, interaction.values[0], interaction.guild.id, "botroledefault").catch(() => { })
            }
            guildconfigbuilder.roleBotDefault(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "8") {
            if (interactioncustomId[4] === "c") {
                initguild.enableTempChannel(interaction.guild, root).catch((err) => {
                    console.log(err)
                })
            } else if (interactioncustomId[4] === "d") {
                initguild.DisableTempChannel(interaction.guild, root).catch((err) => {
                    console.log(err)
                })
            }
            guildconfigbuilder.AllowTempChannel(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "9") {
            if (interactioncustomId[4] === "c") {
                initguild.enableHollydayModule(interaction.guild, root).catch((err) => {
                    console.log(err)
                })
            } else if (interactioncustomId[4] === "d") {
                initguild.DisableHollydayModule(interaction.guild, root).catch((err) => {
                    console.log(err)
                })
            }
            guildconfigbuilder.AllowHollyday(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            })

        } else if (interactioncustomId[2] == "10") {
            guildconfigbuilder.ConfirmGuildConfig(interaction, interactioncustomId, root)
                .then((menu) => {
                    interaction.update({ embeds: menu[0], components: menu[1] }).catch((err) => {
                        console.log(err);
                    });
                    client.holidaymodule.restart()
                }).catch((err) => {
                    console.log(err);
                })

        }
    }

}