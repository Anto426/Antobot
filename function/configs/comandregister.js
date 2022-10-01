
const configs = require("./../../index")
async function shashcomandregisterallguild() {
    configs.client.guilds.cache.forEach((guild) => {
        configs.client.commands.forEach(command => {
            guild.commands.create(command.data).catch((err) => { console.log(err) })

        })
    })
}
async function shashcomandregisteroneguild(guild) {

    configs.client.commands.forEach(command => {
        guild.commands.create(command.data).catch((err) => { console.log(err) })

    })

}
module.exports = {
    shashcomandregisterallguild: shashcomandregisterallguild,
    shashcomandregisteroneguild:shashcomandregisteroneguild
}