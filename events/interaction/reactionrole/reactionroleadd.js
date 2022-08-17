const configs = require("./../../../index")
module.exports = {
    name: "messageReactionAdd",
    async execute(messageReaction, user) {

        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();


        for (let i in configs.settings[messageReaction.message.guild.name].role.reactrole) {
            if (messageReaction.message.id == configs.settings[messageReaction.message.guild.name].role.reactrole[i].id) {
                for (let x in configs.settings[messageReaction.message.guild.name].role.reactrole[i].ruoli) {
                    if (messageReaction._emoji.name == configs.settings[messageReaction.message.guild.name].role.reactrole[i].ruoli[x].emoji) {
                        var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                        utente.roles.add(configs.settings[messageReaction.message.guild.name].role.reactrole[i].ruoli[x].id);
                        return
                    }
                }
            }
        }
    }
}