const cguild = require("./../../settings/guild.json")
function comandregisterguild() {
    try {
        console.log("sto aggiornando  " + client.commands.size + " comandi " + " in " + client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).name)
        client.commands.forEach(command => {
            client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).commands.delete().catch((err) => { console.log(err.toString()) })
            client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).commands.create(command.data).catch((err) => { console.log(err.toString()) })

        })

    } catch {
        console.log("ho riscontrato alcuni errrori nel scrivere i comandi  ")
    }
}
module.exports = {
    comandregisterguild
}