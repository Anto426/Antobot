const { PermissionsBitField } = require("discord.js");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { comandbembed } = require("../../../embed/base/command");

module.exports = {
    name: "untimeout",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: true,
    allowebot: false,
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
                        if (err.code == 50013) {
                            interaction.reply({ embeds: [embedmsg.notPermissionError()], ephemeral: true })
                        } else {
                            interaction.reply({ embeds: [embedmsg.notuntimeoutError()], ephemeral: true })
                        }
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
                interaction.reply({ embeds: [embedmsg.nothavetimeoutError()], ephemeral: true })
            }
            ).catch((err) => {
                console.error(err);
            })
        }


    }
}