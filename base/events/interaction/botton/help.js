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
        let interactioncustomId = interaction.customId.split("-")
        if (interactioncustomId.includes("help")) {
            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction)
                .then(() => {
                    let json = new Cjson()
                    console.log(interactioncustomId)
                    if (interactioncustomId[3] == 0) {
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
                                            value: command.data.options ? command.data.options.map(x => { return `📛 Nome: ${x.name.charAt(0).toUpperCase() + x.name.slice(1)} 📝 Descrizione: ${x.description.charAt(0).toUpperCase() + x.description.slice(1)}\n📝 Tipo: ${getTypeByNumber(x.type)}\n` }).join("\n") : "📋 Non ci sono opzioni per questo comando",
                                        }
                                    )


                                let row = new ActionRowBuilder().addComponents(new ButtonBuilder()
                                    .setCustomId(`help-${interaction.member.id}-${interactioncustomId[2]}-1`)
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
                    }

                    if (interactioncustomId[3] == 1) {

                        json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[6], process.env.GITTOKEN).then((jsonf) => {

                            let embed = new comandbembed(interaction.guild, interaction.member)
                            let CMenu = new Menu()
                            let list = []


                            let comandlist = new StringSelectMenuBuilder()
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
                                    components: CMenu.createMenu(list, "help", comandlist, interaction.member.id, interactioncustomId[2], 0),
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
                    }


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


