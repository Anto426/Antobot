const { EmbedBuilder } = require("discord.js")
const { intclient } = require("./../../functions/client/intclient")
const { boot } = require("./../../functions/client/boot")
const { on } = require("./../../index")
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
let temp = []
module.exports = {
    name: "reboot",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
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
        await client.login(process.env.TOKEN)
        on()
        await boot()
        let embed1 = new EmbedBuilder()
            .setTitle("bot restarted successfully")
            .setThumbnail(cembed.immage.tostrong)
            .setColor(cembed.color.Green)

        setTimeout(() => {
            client.guilds.cache.get(temp[0]).channels.cache.find(x => x.id == temp[1]).send({ embeds: [embed1] })
        }, 1000 * 10);




    }
}