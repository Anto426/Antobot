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
        return new Promise(async () => {
            await interaction.reply({ content: "Il bot si sta riavviando...", ephemeral: true }).catch((err) => { console.log(err) });
            process.exit(0);
        });
    }
}
