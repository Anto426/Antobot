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

        return new Promise(async (resolve, reject) => {

            let queen = await distube.resume(interaction.guild)
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member, queen.songs[0].thumbnail);
            embedmsg.init()
                .then(async () => {
                    interaction.reply({ embeds: [embedmsg.resume(queen.songs[0])] }).catch((err) => {
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