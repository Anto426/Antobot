const { PermissionsBitField } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { errorIndex } = require("../../../function/err/errormenager");

module.exports = {
    name: "timeout",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: true,
    allowebot: false,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "timeout",
        description: "timeout un utente",
        options: [{
            name: "user",
            description: "l'utente il quale vuoi timeoutare",
            type: 6,
            required: true
        },
        {
            "name": "durata",
            "description": "la durata del timeout",
            "type": 4,
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
    async execute(interaction) {

        return new Promise((resolve, reject) => {
            let member = interaction.options.getMember('user');
            let reason = interaction.options.getString('motivo') || "nessun motivo specificato";
            let time = interaction.options.getInteger('durata') * 1000 * 60;



            if (member.communicationDisabledUntilTimestamp == null || member.communicationDisabledUntilTimestamp < Date.now()) {

                let embed = new comandbembed(interaction.guild, interaction.member)
                embed.init().then(() => {
                    member.timeout(time, reason).then(() => {
                        interaction.reply({
                            embeds: [embed.timeout(member, time, reason)],
                        }).catch((err) => {
                            console.error(err);
                        });
                    }).catch((err) => {
                        console.log(err)
                        if (err.code == 50013) {
                            reject(errorIndex.BOT_NOT_PERMISSION_ERROR)
                        } else {
                            reject(errorIndex.GENERIC_ERROR)
                        }
                    })

                }).catch((err) => {
                    console.log(err)
                    reject(errorIndex.NOT_TIMEOUT_ERROR)
                })
            } else {
                console.log("utente già timeoutato")
                reject(errorIndex.IS_JUST_TIMEOUT_ERROR)
            }

        });


    }
}