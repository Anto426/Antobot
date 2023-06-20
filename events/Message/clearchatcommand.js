const cgild = require('../../settings/guild.json');

module.exports = {
    name: "messageCreate",
    async execute(message) {

        try {
            cgild['Anto\'s  Server'].channel.allowchannel.forEach(x => {
                if (message.channel.id == x && !message.author.bot) {
                    message.delete().catch(() => { })
                    return
                }
                
            })
        } catch (err) { console.log(err) }
    }
}
