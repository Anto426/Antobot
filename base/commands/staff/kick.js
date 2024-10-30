const { PermissionsBitField } = require("discord.js");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { comandbembed } = require("../../../embed/base/command");
const { errorIndex } = require("../../../function/err/errormenager");
module.exports = {
    name: "kick",
    permisions: [PermissionsBitField.Flags.KickMembers],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "kick",
        description: "kikka un utente",
        options: [{
            name: "user",
            description: "l'utente il quale vuoi kikkare",
            type: 6,
            required: true
        },
        {
            name: "motivo",
            description: "il motivo del kick",
            type: 3,
            required: false
        }]
    },
    execute(interaction) {

        return new Promise((resolve, reject) => {


            let embed = new comandbembed(interaction.guild, interaction.member)
            let member = interaction.options.getMember('user');
            let reason = interaction.options.getString('motivo') || "nessun motivo specificato";


            embed.init().then(() => {
                member.kick(reason).then(() => {
                    interaction.reply({
                        embeds: [embed.kick(member, reason)],
                    }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        if (err.code == 50013) {
                            reject(errorIndex.BOT_NOT_PERMISSION_ERROR)
                        } else {
                            reject(errorIndex.NOT_KICK_ERROR)
                        }
                        resolve(0)
                    }
                    ).catch((err) => {
                        console.error(err);
                    })
                })
            }).catch((err) => {
                console.log(err)
                reject(errorIndex.GENERIC_ERROR)
            })
        })
    }
}