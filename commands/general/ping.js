

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: [],
    OnlyOwner: false,
    position: false,
    test: false,
    data: {
        name: "ping",
        description: "test latenza bot"
    },
    execute(interaction) {
        interaction.reply("g")
    }
}