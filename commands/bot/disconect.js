const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
const fs = require("fs")
const patch = "./.env"
module.exports = {
    name: "disconect",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: false,
    data: {
        name: "disconect",
        description: "disconette il client dal bot"
    },
    async execute(interaction) {
        console.log("disconect.......")
        var embed = new EmbedBuilder()
            .setTitle("disconecting")
            .setThumbnail(cembed.immage.load)
            .setColor(cembed.color.Yellow)
        await interaction.reply({ embeds: [embed] })
        await fs.unlinkSync(patch);
        await client.destroy()
        process.exit()


    }
}