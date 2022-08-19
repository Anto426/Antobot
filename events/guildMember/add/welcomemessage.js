const canavasf = require("./../../../function/canavas/canavasfunctions")
const configs = require("./../../../index")

module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
        let buffer = await canavasf.createimage(member, "Welcome", true)
        let attachment = new configs.Discord.MessageAttachment(buffer, "canvas.png")
        let embed = new configs.Discord.EmbedBuilder()
            .setColor(configs.settings.embed.color.red)
            .setTitle("Welcome")
            .setDescription(`${member} Benvenuto su ${member.guild.name} te sei il ${humans.size} membro  ! Ti consiglio di andare a leggere il <#${configs.settings[member.guild.name].stanze.regolamento}> per non essere bannato !!`)

        channel = member.guild.channels.cache.get(configs.settings[member.guild.name].stanze.welcome)
        channel.send({ embeds: [embed], files: [attachment] })



    }
}

