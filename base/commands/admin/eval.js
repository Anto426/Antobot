const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");

module.exports = {
    name: "eval",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: true,
    position: false,
    test: false,
    see: true,
    data: {
        name: "eval",
        description: "Esegui i comandi js",
        options: [{
            name: "comand",
            description: "comando da eseguire",
            type: 3,
            required: true
        }]
    },

    async execute(interaction) {
        let embed = new comandbembed(interaction.guild, interaction.member)
        let command = interaction.options.getString('comand');
        embed.init().then(async () => {

            let result = await eval(command);
            interaction.reply({ embeds: [embed.eval(result)] }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.evaleError()], ephemeral: true }).catch((err) => {
                    console.error(err);
                })
            }).catch((err) => {
                console.error(err);
            })
        })


    }


}
