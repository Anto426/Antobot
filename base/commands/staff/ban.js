const { PermissionsBitField } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "ban",
    permisions: [PermissionsBitField.Flags.BanMembers],
    allowedchannels: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "ban",
        description: "banna un utente",
        options: [{
            name: "user",
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
        let member = interaction.options.getMember('user');
        let reason = interaction.options.getString('motivo') || "nessun motivo specificato";

        embed.init().then(() => {
            member.ban({ reason: reason }).then(() => {
                interaction.reply({
                    embeds: [embed.ban(member, reason)],
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