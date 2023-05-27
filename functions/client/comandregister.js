const cguild = require("./../../settings/guild.json")

async function comanddeleteguild() {
    try {
        const commands = await client.application.commands.fetch();

        for (const command of commands.values()) {
            await command.delete();
        }

        console.log('Tutti gli slash command sono stati cancellati.');

    } catch (err) {
        console.log("ho riscontrato alcuni errrori nel cancellare i comandi  ", err)
    }
}
async function comandregisterguild() {
    try {

        await comanddeleteguild()
        console.log("sto aggiornando  " + client.commands.size + " comandi " + " in " + client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).name)
        client.commands.forEach(command => {
            client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).commands.create(command.data).catch((err) => { console.log(err.toString()) })

        })

    } catch {
        console.log("ho riscontrato alcuni errrori nel scrivere i comandi  ")
    }
}

module.exports = {
    comandregisterguild,
    comanddeleteguild
}