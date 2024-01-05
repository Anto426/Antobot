

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: false,
    position: false,
    test: false,
    data: {
        name: "ping",
        description: "test latenza bot"
    },
    execute(interaction) {
        interaction.reply(g)
    }
}