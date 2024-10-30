const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");

module.exports = {
    name: "reboot",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: true,
    position: false,
    test: false,
    see: true,
    data: {
        name: "reboot",
        description: "Comando per riavviare il bot",
    },
    async execute(interaction) {

        await interaction.reply({ content: "Il bot si sta riavviando...", ephemeral: true });
        process.exit(0);
        


        


    }


}
