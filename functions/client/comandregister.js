

function comandregisterallguild() {

    client.guilds.cache.forEach(guild => {
        console.log("I'm writinig " + client.commands.size + " command " + " in " + guild.name)
        client.commands.forEach(command => {
            guild.commands.create(command.data).catch((err) => { console.log(err.toString()) })

        })
    })


}
function comandregisteroneguild(guild) {
    console.log("I'm writinig " + client.commands.size + " command " + " in " + guild.name)
    client.commands.forEach(command => {
        guild.commands.create(command.data).catch((err) => { console.log(err.toString()) })

    })


}
module.exports = {
    comandregisterallguild,
    comandregisteroneguild
}