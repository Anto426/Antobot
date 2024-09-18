const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Cjson } = require("../../file/json");
const { Menu } = require("../../row/menu");
const { ErrEmbed } = require("../../../embed/err/errembed");
const setting = require("../../../setting/settings.json");
const { comandbembed } = require("../../../embed/base/command");


class helppagebuilder {

    constructor() {
        this.Menu = new Menu();
        this.Cjson = new Cjson();
    }

    async mainpage(interaction, interactioncustomId) {

        return await new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member);
            let list = [];

            this.Cjson.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[6], process.env.GITTOKEN).then((jsonf) => {
                embed.init().then(() => {

                    let comandlist = new StringSelectMenuBuilder()
                        .setCustomId(`help-${interaction.member.id}-1-0`)
                        .setPlaceholder('Scegli un comando');

                    client.commandg.sort().forEach(command => {
                        if (command.see) {
                            list.push(new StringSelectMenuOptionBuilder()
                                .setLabel(`${jsonf.command[command.name] ? jsonf.command[command.name].emoji : "⚙️"} ${command.data.name}`)
                                .setDescription(`${command.data.description}`)
                                .setValue(`${command.data.name}`));
                        }

                    });

                    resolve([[embed.help()], this.Menu.createMenu(list, "help", comandlist, interaction.member.id, 0, interactioncustomId[3])]);

                }).catch((err) => {
                    console.log(err);
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true });
                    }
                    ).catch((err) => {
                        console.log(err);
                    });
                });

            }).catch((err) => {
                console.log(err);
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true });
                }
                ).catch((err) => {
                    console.log(err);
                });
            });

        });
    }

    async commandpage(interaction, command, interactioncustomId) {

        let interactioncustomId = interaction.customId.toString().split("-");

        return await new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member);

            this.Cjson.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[6], process.env.GITTOKEN).then((jsonf) => {
                embed.init().then(() => {

                    if (command) {
                        let row = new ActionRowBuilder().addComponents(new ButtonBuilder()
                            .setCustomId(`help-${interaction.member.id}-0-${interactioncustomId[3]}`)
                            .setLabel('Indietro')
                            .setStyle(ButtonStyle.Success))

                        resolve([[embed.commandInformation(command, jsonf)], [row]]);
                    } else {
                        let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                        embedmsg.init().then(() => {
                            interaction.reply({ embeds: [embedmsg.CommandNotFountError()], ephemeral: true });
                        }
                        ).catch((err) => {
                            console.log(err);
                        });
                    }

                }).catch((err) => {
                    console.log(err);
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true });
                    }
                    ).catch((err) => {
                        console.log(err);
                    });
                });

            }).catch((err) => {
                console.log(err);
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true });
                }
                ).catch((err) => {
                    console.log(err);
                });
            });

        });

    }

}



module.exports = { helppagebuilder }