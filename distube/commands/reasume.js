const { CommandEmbed } = require("../../embed/distube/command");
const { errorIndex } = require("../../function/err/errormenager");

module.exports = {
    name: "resume",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    position: false,
    test: false,
    see: true,
    disTube: {
        checkchannel: true,
        checklisttrack: true
    },
    data: {
        name: "resume",
        description: "riprende la canzone",
    },
    async execute(interaction) {

        return new Promise((resolve, reject) => {
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
            embedmsg.init()
                .then(async () => {
                    distube.resume(interaction.guild)
                    interaction.reply({ embeds: [embedmsg.resume()] }).catch((err) => {
                        console.error(err);
                    })
                    resolve(0);
                }).catch((err) => {
                    reject(errorIndex.PLAY_ERROR);
                    console.error(err);
                });
        })
    }

}