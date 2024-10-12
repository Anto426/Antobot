const { comandbembed } = require("../../../embed/base/command")
const { Time } = require("../../../function/time/time")

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
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
        let Timea = new Time().fortmatTimestamp(new Date().getTime() - Timeon)
        let latenza = `${client.ws.ping}ms`
        let ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} mb`;
        
        embed.init().then(() => {
            interaction.reply({ embeds: [embed.ping(latenza, ram, Timea)] }).catch((err) => {
                console.error(err);
            })
        })
    }
}