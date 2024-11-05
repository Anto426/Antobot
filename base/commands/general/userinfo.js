const { comandbembed } = require("../../../embed/base/command");
const { errorIndex } = require("../../../function/err/errormenager");
module.exports = {
    name: "userinfo",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "userinfo",
        description: "ritorna le informazioni del server",
        options: [{
            name: "user",
            description: "l'utente di cui vuoi le informazioni",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {
        return new Promise((resolve, reject) => {
            let embed = new comandbembed(interaction.guild, interaction.member)
            let member = interaction.options.getMember('user') || interaction.member;
            embed.init().then(() => {
                interaction.reply({
                    embeds: [embed.userinfo(member)],
                }).catch((err) => {
                    console.error(err);
                });
                resolve(0);
            }).catch((err) => {
                console.log(err)
                reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)
            })
        });
    }
}