const { comandbembed } = require("../../../embed/base/command")
const { BotConsole } = require("../../../function/log/botConsole")

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
        embed.init().then(async () => {
            let embedmsg = embed.eval();
            let command = interaction.options.getString('comand');
            try {
                let on = await eval(command);
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
                new BotConsole().log(error)
                embedmsg
                    .setDescription("Comando non eseguito")
            }
            interaction.reply({ embeds: [embedmsg] })
        })

    }
}