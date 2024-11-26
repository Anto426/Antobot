const { comandbembed } = require("../../../embed/base/command");

module.exports = {
    name: "useravatar",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "useravatar",
        description: "ritorna l'avatar dell'utente",
        options: [{
            name: "user",
            description: "l'utente di cui vuoi l'avatar",
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
                    embeds: [embed.avatar(member)],
                }).catch((err) => { console.log(err) });
                resolve(0);
            }).catch((err) => {
                console.log(err)
                reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)
            })
        });
    }
}