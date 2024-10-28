const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { PermissionsBitField } = require("discord.js");
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
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.bulkdeleteError()], ephemeral: true }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                    console.error(err);
                });
            });
        }).catch((err) => {
            console.error(err);
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        });




    }
}