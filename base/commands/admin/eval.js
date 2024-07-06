const { comandbembed } = require("../../../embed/base/command")
const { consolelog } = require("../../../function/log/consolelog")
const setting = require("../../../setting/settings.json")

module.exports = {
    name: "eval",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: true,
    position: false,
    test: true,
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
        embed.init().then(() => {
            let embedmsg = embed.eval();
            let command = interaction.options.getString('comand');
            try {
                let on = eval(command).toString();
                console.log(on);
                embedmsg
                    .setDescription("Comando eseguito con successo")
                    .addFields(
                        {
                            name: "Output",
                            value: `\`\`\`${on}\`\`\``,
                            inline: false
                        }
                    );

            } catch (error) {
                embedmsg
                    .setDescription("Comando non eseguito")
            }
            interaction.reply({ embeds: [embedmsg] })
        })

    }
}