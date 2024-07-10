const { comandbembed } = require("../../../embed/base/command")
const { time } = require("../../../function/time/time")

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "ping",
        description: "Test latenza"
    },
    execute(interaction) {
        let embed = new comandbembed(interaction.guild, interaction.member)
        let timea = new time().formatttimedayscale(new Date().getTime() - timeon)
        let latenza = `${client.ws.ping}ms`
        let ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} mb`;
        embed.init().then(() => {
            interaction.reply({ embeds: [embed.ping(latenza, ram, timea)] })
        })
    }
}