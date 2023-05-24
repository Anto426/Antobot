const { EmbedBuilder } = require("discord.js")
const { intclient } = require("./../../functions/client/intclient")
const { boot } = require("./../../functions/client/boot")
const cembed = require("./../../setting/embed.json")
const { eventload } = require("../../functions/client/loadc-e")
let temp = []
module.exports = {
    name: "reboot",
    permisions: [],
    allowedchannels: global.AllowCommands,
    position: false,
    test: false,
    data: {
        name: "reboot",
        description: "Riavvia il bot"
    },
    async execute(interaction) {
        temp.push(interaction.guild.id)
        temp.push(interaction.channel.id)
        console.log("rebotting.......")
        var embed = new EmbedBuilder()
            .setTitle("Rebooting")
            .setThumbnail(cembed.immage.load)
            .setColor(cembed.color.Yellow)
        await interaction.reply({ embeds: [embed] })
        bootstate = false
        await client.destroy()
        await intclient()
        await client.login(process.env.TOKEN).then(async () => {
            await eventload()
        })
        await boot()
        let embed1 = new EmbedBuilder()
            .setTitle("bot restarted successfully")
            .setThumbnail(cembed.immage.tostrong)
            .setColor(cembed.color.Green)

        setTimeout(() => {
            timeonc = 0
            client.guilds.cache.get(temp[0]).channels.cache.find(x => x.id == temp[1]).send({ embeds: [embed1] })
        }, 1000 * 20);




    }
}