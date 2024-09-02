const { PermissionsBitField } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "useravatar",
    permisions: [PermissionsBitField.Flags.BanMembers],
    allowedchannels: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "ban",
        description: "banna un utente",
        options: [{
            name: "utente",
            description: "l'utente il quale vuoi bannare",
            type: 6,
            required: true
        },
        {
            name: "motivo",
            description: "il motivo del ban",
            type: 3,
            required: false
        }]
    },
    execute(interaction) {

        let embed = new comandbembed(interaction.guild, interaction.member)
        let member = interaction.options.getMember('utente');
        let reason = interaction.options.getString('motivo') || "nessun motivo specificato";

        embed.init().then(() => {
            member.ban({ reason: reason }).then(() => {
                interaction.reply({
                    embeds: [embed.ban(member, motivo)],
                });
            }).catch((err) => {
                console.log(err)
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.notbanError()], ephemeral: true })
                }
                ).catch((err) => {
                    console.error(err);
                })
            })
        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
            }
            ).catch((err) => {
                console.error(err);
            })
        })




    }
}