const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { PermissionsBitField } = require("discord.js");
const setting = require("../../../setting/settings.json");
module.exports = {
    name: "announce",
    permissions: [PermissionsBitField.Flags.ManageGuild],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "announce",
        description: "Comando per inviare un annuncio nel Server",
        options: 
        [
            {
                name: "message",
                description: "Il messaggio da inviare",
                type: 3,
                required: true
            },
            {
                name: "tag_everyone",
                description: "Vuoi taggare everyone?",
                type: 5,
                required: true
            }
        ]
    },
    execute(interaction) {

        let embed = new comandbembed(interaction.guild, interaction.member)
        let message = interaction.options.getString('message')
        let tag = interaction.options.getBoolean('tag_everyone')
        let everyone = tag ? interaction.guild.roles.everyone : ""

        embed.init().then(async () => {
            let data = await json.readJso(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig)

            if (data[interaction.guild.id].annuncechannel == null) {
                interaction.reply({ content: "Non hai impostato il canale per gli annunci", ephemeral: true }).catch((err) => {
                    console.error(err);
                })
                return;
            } else {
                let channel = interaction.guild.channels.cache.get(data[interaction.guild.id].annuncechannel)
                interaction.channel.send({ embeds: [embed.annunce(message)] }).then(() => {
                    interaction.reply({
                        embeds: [embed.annunce(message, everyone)],
                        ephemeral: true
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true }).catch((err) => {
                            console.error(err);
                        })
                    }
                    ).catch((err) => {
                        console.error(err);
                    })
                })
            }

        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true }).catch((err) => {
                    console.error(err);
                })
            }
            ).catch((err) => {
                console.error(err);
            })
        })
    }
}