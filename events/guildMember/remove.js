let functions = require("./../../function/roomandticket/function")
module.exports = {
    name: `guildMemberRemove`,
    async execute(member) {
        if (member.user.bot) {
            return
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Left")
                .setDescription(` ${member} ha abbandonati il server`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

            let channel = member.guild.channels.cache.find(x => x.id == configs[member.guild.name].stanze.left)
            channel.send({ embeds: [embed] }).catch(() => {})

            let type = "ticket"
            for (let i = 0; i < 2; i++) {
                functions.remove(member, type)
                type = "room"
            }







        }


    }
};