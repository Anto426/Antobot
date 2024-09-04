const { botton } = require("../../../../function/interaction/botton");
const { Cjson } = require("../../../../function/file/json");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const setting = require("../../../../setting/settings.json");
const { comandbembed } = require("../../../../embed/base/command");
const { BaseEmbed } = require("../../../../embed/baseembed");
const { Menu } = require("../../../../function/row/menu");
const { ErrEmbed } = require("../../../../embed/err/errembed");
module.exports = {
    name: "help",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) return;

        if (interaction.customId.split("-").includes("help")) {
            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction)
                .then(() => {
                    let json = new Cjson()
                    json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[6], process.env.GITTOKEN).then((jsonf) => {
                        new BaseEmbed(interaction.guild, interaction.member).init().then((embedbase) => {
                            const command = client.commandg.get(interaction.values[0])
                            embedbase
                                .setTitle(`${jsonf.command[command.name].emoji}  ${command.name}`)
                                .setColor(embedconfig.color.green)
                                .setDescription(jsonf.command[command.name].description)
                                .setThumbnail(jsonf.command[command.name].image)
                                .addFields(
                                    {
                                        name: "🔑 Permessi",
                                        value: (command.permisions.length == 0 && !command.OnlyOwner) ? "🔓Libero" : "🔐Bloccato",
                                        inline: true
                                    },
                                    {
                                        name: "🌐 Libero su tutti i canali",
                                        value: command.allowedchannels ? "⚔️No" : "🏇Si",
                                        inline: true
                                    },
                                    {
                                        name: "🤖 Appartenente al client",
                                        value: `🤖${command.type}`,
                                        inline: true
                                    },
                                    {
                                        name: "📋 Option",
                                        value: command.data.options ? command.data.options.map(x => { return `📛 Nome: ${x.name.charAt(0).toUpperCase() + x.name.slice(1)} 📝 Descrizione: ${x.name.charAt(0).toUpperCase() + x.name.slice(1)} 📝 Tipo: ${getTypeByNumber(x.type)}` }).join("\n") : "📋 Non ci sono opzioni per questo comando",
                                    }
                                )


                            let row = new ActionRowBuilder().addComponents(new ButtonBuilder()
                                .setCustomId(`helpm-${interaction.member.id}-down-${interaction.customId.split("-")[3]}`)
                                .setLabel('Indietro')
                                .setStyle(ButtonStyle.Success))


                            interaction.update({ embeds: [embedbase], components: [row] })


                        }).catch((err) => {
                            console.error(err);
                            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                            embedmsg.init().then(() => {
                                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                            }
                            ).catch((err) => {
                                console.error(err);
                            })
                        })
                    })

                }).catch(() => { })
        }

        if (interaction.customId.split("-").includes("helpm")) {
            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction).then(() => {
                let json = new Cjson()
                json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[6], process.env.GITTOKEN).then((jsonf) => {

                    let embed = new comandbembed(interaction.guild, interaction.member)
                    let CMenu = new Menu()
                    let list = []


                    let comandlist = new StringSelectMenuBuilder()
                        .setCustomId(`help-${interaction.member.id}`)
                        .setPlaceholder('Scegli un comando')

                    client.commandg.forEach(command => {
                        if (command.see) {

                            list.push(new StringSelectMenuOptionBuilder()
                                .setLabel(`${jsonf.command[command.name] ? jsonf.command[command.name].emoji : "⚙️"} ${command.data.name}`)
                                .setDescription(`${command.data.description}`)
                                .setValue(`${command.data.name}`))
                        }

                    });

                    embed.init().then(() => {
                        interaction.update({
                            embeds: [embed.help()],
                            components: CMenu.createMenu(list, "helpm", comandlist, interaction.member.id, interaction.customId.split("-")[3]),
                        });
                    })

                }).catch(() => {
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                    }
                    ).catch((err) => {
                        console.error(err);
                    })
                })

            }).catch(() => { })

        }

        function getTypeByNumber(number) {
            switch (number) {
                case 11:
                    return 'Attachment';
                case 5:
                    return 'Boolean';
                case 7:
                    return 'Channel';
                case 4:
                    return 'Intero';
                case 9:
                    return 'Mentionable';
                case 10:
                    return 'Number';
                case 8:
                    return 'Role';
                case 3:
                    return 'String';
                case 1:
                    return 'Subcommand';
                case 2:
                    return 'SubcommandGroup';
                case 6:
                    return 'User';
                default:
                    return 'Unknown';
            }
        }


    }
}


