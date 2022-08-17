const configs = require("./../../index")
module.exports = {
    name: "messageReactionRemove",
    async execute(messageReaction, user) {

        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (messageReaction.message.id == configs[messageReaction.message.guild.name].role.reactrole.message1) {

            for (let role in configs[messageReaction.message.guild.name].role.reactrole.ruoli) {
                if (messageReaction._emoji.name == configs[messageReaction.message.guild.name].role.reactrole.ruoli[role].emoji) {
                    var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                    utente.roles.remove(configs[messageReaction.message.guild.name].role.reactrole.ruoli[role].id);
                    return
                }
            }
        }
        if (messageReaction.message.id == configs[messageReaction.message.guild.name].role.reactrole.message2) {

            for (let role1 in configs[messageReaction.message.guild.name].role.reactrole.sesso) {
                if (messageReaction._emoji.name == configs[messageReaction.message.guild.name].role.reactrole.sesso[role1].emoji) {
                    var utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                    utente.roles.remove(configs[messageReaction.message.guild.name].role.reactrole.sesso[role1].id);
                    return
                }
            }
        }
    }
}