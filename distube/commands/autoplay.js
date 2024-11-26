const { CommandEmbed } = require("../../embed/distube/command")

module.exports = {
    name: "autoplay",
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
        name: "autoplay",
        description: "enable/disable autoplay"
    },
    async execute(interaction) {

        return new Promise((resolve, reject) => {
            let queue = distube.getQueue(interaction);
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member);
            embedmsg.init().then(() => {
                queue.autoplay = !queue.autoplay;
                interaction.reply({ embeds: [embedmsg.autoplay(queue.autoplay)] }).catch((err) => {
                    console.error(err);
                });
                resolve(0);
            }).catch((err) => {
                console.error(err);
                reject(errorIndex.GENERIC_ERROR);
            });
        });

    }
}