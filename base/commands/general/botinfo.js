const { comandbembed } = require("../../../embed/base/command");


module.exports = {
    name: "botinfo",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "botinfo",
        description: "ritorna le informazioni del bot"
    },
    execute(interaction) {
        return new Promise((resolve, reject) => {
            let embed = new comandbembed(interaction.guild, interaction.member)
            embed.init().then(() => {
                interaction.reply({
                    embeds: [embed.botinfo(client.user)],
                }).catch((err) => { console.log(err) });
                resolve(0)
            }).catch((err) => {
                console.log(err)
                reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)
            })
        });
    }
}