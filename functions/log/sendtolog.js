const cguild = require("./../../settings/guild.json")
async function sendtoalllog(content) {

    try {
        for (let i in cguild["Anto's  Server"].channel.bot) {
            client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.find(x => x.id == cguild["Anto's  Server"].channel.bot[i]).send(content)
        }
    } catch (err) { console.log(err) }

}
async function sendtoprlog(content) {

    try {
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.find(x => x.id == cguild["Anto's  Server"].channel.bot["private-log"]).send(content)
    } catch (err) { console.log(err) }

}
module.exports = { sendtoalllog, sendtoprlog }