const canavasf = require("./../../../function/canavas/canavasfunctions")
module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {

        let attachment = await canavasf.createimage(member,"Welcome",true)
        let embed = new configs.Discord.EmbedBuilder()
            .setColor("RANDOM")
            .setTitle("Welcome")
            .setDescription(`${member} Benvenuto su ${member.guild.name} te sei il ${humans.size} membro  ! Ti consiglio di andare a leggere il <#${configs[member.guild.name].stanze.regolamento}> per non essere bannato !!`)
            .setImage("attachment://canvas.png")

        channel.send({ embeds: [embed], files: [attachment] })



    }
}

