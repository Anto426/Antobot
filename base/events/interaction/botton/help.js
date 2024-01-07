const { baseembed } = require("../../../../embed/baseembed");
const { errembed } = require("../../../../embed/err/errembed");
const { botton } = require("../../../../function/interaction/botton");
const { Cjson } = require("../../../../function/json/json");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');


const setting = require("../../../../setting/settings.json");
const { menu } = require("../../../../function/row/menu");
const { comandbembed } = require("../../../../embed/base/command");
module.exports = {
    name: "help",
    typeEvent: "interactionCreate",
    async execute(interaction) {
        if (interaction.isChatInputCommand()) return;
        if (interaction.customId.split("-").includes("help")) {
            let Cbotton = new botton()
            Cbotton.checkisyourbotton(interaction)
                .then(() => {
                    let json = new Cjson()
                    json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[6], client.gitToken).then((jsonf) => {
                        new baseembed(interaction.guild, interaction.member).init().then((embedbase) => {
                            const command = client.basecommands.get(interaction.values[0])

                            embedbase
                                .setTitle("⚙️ " + command.name)
                                .setColor(embedconfig.color.green)
                                .setDescription(jsonf.command[command.name])
                                .setThumbnail(embedconfig.image.help)
                                .addFields(
                                    {
                                        name: "Permessi",
                                        value: command.permisions.size != 0 ? "🔓Libero" : "🔐Bloccato",
                                        inline: true
                                    },
                                    {
                                        name: "Libero su tutti i canali",
                                        value: command.allowedchannels ? "⚔️No" : "🏇Si",
                                        inline: true
                                    },
                                )


                            let row = new ActionRowBuilder().addComponents(new ButtonBuilder()
                                .setCustomId(`helpm-${interaction.member.id}-down-${interaction.customId.split("-")[3]}`)
                                .setLabel('Indietro')
                                .setStyle(ButtonStyle.Success))


                            interaction.update({ embeds: [embedbase], components: [row] })


                        }).catch(() => { })
                    })

                }).catch(() => { })
        }

        if (interaction.customId.split("-").includes("helpm")) {

            let embed = new comandbembed(interaction.guild, interaction.member)
            let Cmenu = new menu()
            let list = []


            let comandlist = new StringSelectMenuBuilder()
                .setCustomId(`help-${interaction.member.id}`)
                .setPlaceholder('Scegli un comando')

            client.basecommands.forEach(command => {
                if (command.see) {
                    list.push(new StringSelectMenuOptionBuilder()
                        .setLabel(`⚙️ ${command.data.name}`)
                        .setDescription(`${command.data.description}`)
                        .setValue(`${command.data.name}`))
                }

            });

            embed.init().then(() => {
                interaction.update({
                    embeds: [embed.help()],
                    components: Cmenu.createmenu(list, "helpm", comandlist, interaction.member.id, interaction.customId.split("-")[3]),
                });
            })


        }
    }
}