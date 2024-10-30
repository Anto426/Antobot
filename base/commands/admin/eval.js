const { comandbembed } = require("../../../embed/base/command");
const { errorIndex } = require("../../../function/err/errormenager");
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

        return new Promise((resolve, reject) => {
            let embed = new comandbembed(interaction.guild, interaction.member)
            let command = interaction.options.getString('comand');
            embed.init().then(async () => {

                let result = await eval(command);
                interaction.reply({ embeds: [embed.eval(result)] }).catch((err) => {
                    console.log(err)
                })
                resolve(0)
            }).catch((err) => {
                console.log(err)
                reject(errorIndex.EVAL_ERROR)
            })
        });

    }


}
