const { consolelog } = require("../log/console/consolelog")

function comandregisterallguild() {

    client.guilds.cache.forEach(guild => {
        consolelog("I'm writinig " + client.commands.size + " command " + " in " + guild.name)
        client.commands.forEach(command => {
            guild.commands.create(command.data).catch((err) => { consolelog(err.toString()) })

        })
    })


}
function comandregisteroneguild(guild) {
    consolelog("I'm writinig " + client.commands.size + " command " + " in " + guild.name)
    client.commands.forEach(command => {
        guild.commands.create(command.data).catch((err) => { consolelog(err.toString()) })

    })


}
module.exports = {
    comandregisterallguild,
    comandregisteroneguild
}