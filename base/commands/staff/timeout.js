const { PermissionsBitField } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "timeout",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "timeout",
        description: "timeout un utente",
        options: [{
            name: "utente",
            description: "l'utente il quale vuoi timeoutare",
            type: 6,
            required: true
        },
        {
            "name": "durata",
            "description": "la durata del timeout",
            "type": 3,
            choices: [{
                name: "⏱️ 1 min",
                value: 1
            }, {
                name: "⏱️ 2 min",
                value: 2
            }, {
                name: "⏱️ 5 min",
                value: 5
            }, {
                name: "⏱️ 10 min",
                value: 10
            }, {
                name: "⏱️ 15 min",
                value: 15
            }, {
                name: "⏱️ 30 min",
                value: 30
            }, {
                name: "🕒 1 h",
                value: 60
            }, {
                name: "🕒 2 h",
                value: 120
            }, {
                name: "📅 1 d",
                value: 1440
            }, {
                name: "📅 1 settimana",
                value: 10080
            }],
            required: true
        },
        {
            name: "motivo",
            description: "il motivo del timeout",
            type: 3,
            required: false
        }]
    },
    execute(interaction) {

        let member = interaction.options.getMember('utente');
        let reason = interaction.options.getString('motivo') || "nessun motivo specificato";
        let time = interaction.options.getInteger('durata');


        if (member.communicationDisabledUntilTimestamp == null || member.communicationDisabledUntilTimestamp < Date.now() && !member.bot) {

            let embed = new comandbembed(interaction.guild, interaction.member)
            embed.init().then(() => {
                member.timeout().then(() => {
                    interaction.reply({
                        embeds: [embed.timeout(member, time, reason)],
                    });
                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.notkickError()], ephemeral: true })
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
                    interaction.reply({ embeds: [embedmsg.isjusttimeoutError()], ephemeral: true })
                }
            }
            ).catch((err) => {
                console.error(err);
            })
        }


    }
}