const cguild = require("./../../settings/guild.json")
function comandregisterguild(guild) {
    console.log("I'm writinig " + client.commands.size + " command " + " in " + guild.name)
    client.commands.forEach(command => {
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).commands.create(command.data).catch((err) => { console.log(err.toString()) })

    })


}
module.exports = {
    comandregisterguild
}