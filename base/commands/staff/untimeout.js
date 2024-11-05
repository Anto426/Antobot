const { PermissionsBitField } = require("discord.js");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { comandbembed } = require("../../../embed/base/command");
const { errorIndex } = require("../../../function/err/errormenager");

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


        return new Promise((resolve, reject) => {

            let member = interaction.options.getMember('user');


            if (member.communicationDisabledUntilTimestamp != null || member.communicationDisabledUntilTimestamp > Date.now()) {

                let embed = new comandbembed(interaction.guild, interaction.member)
                embed.init().then(() => {
                    member.timeout(null).then(() => {
                        interaction.reply({
                            embeds: [embed.untimeout(member)],
                        }).catch((err) => {
                            console.error(err);
                        });
                    }).catch((err) => {
                        console.log(err)
                        if (err.code == 50013) {
                            reject(errorIndex.REPLY_ERRORS.BOT_NOT_PERMISSION_ERROR)
                        } else {
                            reject(errorIndex.REPLY_ERRORS.NOT_UNTIMEOUT_ERROR)
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                    reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)
                })


            } else {
                console.log("utente già untimeoutato")
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    reject(errorIndex.REPLY_ERRORS.NOT_HAVE_TIMEOUT_ERROR)
                }
                ).catch((err) => {
                    console.error(err);
                })
            }

        });



    }
}