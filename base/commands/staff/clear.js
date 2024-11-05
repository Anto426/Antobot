const { comandbembed } = require("../../../embed/base/command");
const { PermissionsBitField } = require("discord.js");
const { errorIndex } = require("../../../function/err/errormenager");
module.exports = {
    name: "clear",
    permisions: [PermissionsBitField.Flags.ManageMessages],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "clear",
        description: "cancella tot messaggi dal canale",
        options: [
            {
                name: "quantità",
                description: "quanti messaggi cancellare",
                type: 4,
                required: true
            }
        ]
    },
    execute(interaction) {

        return new Promise((resolve, reject) => {

            let embed = new comandbembed(interaction.guild, interaction.member);
            let tempamount = interaction.options.getInteger('quantità');
            let amount = tempamount < 100 ? (tempamount ? tempamount : 1) : 100;

            embed.init().then(() => {
                interaction.channel.bulkDelete(amount).then(() => {
                    interaction.reply({
                        embeds: [embed.clear(amount)],
                        ephemeral: true
                    }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                    console.error(err);
                    reject(errorIndex.REPLY_ERRORS.BULK_DELETE_ERROR)
                });
                resolve(0)
            }).catch((err) => {
                console.error(err);
                reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)
            });
        });

    }
}