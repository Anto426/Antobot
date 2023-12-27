module.exports = {
    name: "testembed",
    permisions: [],
    allowedchannels: [],
    OnlyOwner: true,
    position: false,
    test: false,
    data: {
        name: "testembed",
        description: "Testa gli embed"
    },
    execute(interaction) {
        interaction.reply("g")
    }
}