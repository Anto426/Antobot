const { PermissionsBitField } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "untimeout",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "untimeout",
        description: "untimeout un utente",
        options: [{
            name: "user",
            description: "l'utente il quale vuoi untimeoutare",
            type: 6,
            required: true
        }]
    },
    execute(interaction) {

        let member = interaction.options.getMember('user');


        if (member.communicationDisabledUntilTimestamp != null || member.communicationDisabledUntilTimestamp > Date.now() && !member.bot) {

            let embed = new comandbembed(interaction.guild, interaction.member)
            embed.init().then(() => {
                member.timeout(null).then(() => {
                    interaction.reply({
                        embeds: [embed.untimeout(member)],
                    });
                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.notuntimeoutError()], ephemeral: true })
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


        } else {
            console.log("utente già timeoutato")
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                if (member.bot) {
                    interaction.reply({ embeds: [embedmsg.botUserError()], ephemeral: true })
                } else {
                    interaction.reply({ embeds: [embedmsg.nothavetimeoutError()], ephemeral: true })
                }
            }
            ).catch((err) => {
                console.error(err);
            })
        }


    }
}