const { congratulatioembed } = require("../../embeds/hollyday/hollydayembed");
const chollyday = require("../../settings/hollyday.json")
const info = require("../../package.json");
const { mainhollyday } = require("../count/hollydaycount");
const { statusupdate } = require("./clientstatus");
const { comandregisterguild } = require("./comandregister");
const { eventload, comandload } = require("./loadc-e");
const { timeon } = require("./timeon");

async function boot() {
    try {
        console.log(`
Welcome To Anto's Bot V${info.version}
    
-Client Name : ${client.user.username}

-Discordjs v: ${info.dependencies['discord.js']}

-Client ID :  ${client.user.id}
    
-N. guild: ${client.guilds.cache.size}
               
-Token: ${client.token}
    
-Link: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands
    
-Repo: https://github.com/Anto426

By Anto426
-------------------------------------------------------------------------------------
    
`,)
        congratulatioembed(chollyday.holidays[3])
        timeon()
        await comandload()
        comandregisterguild()
        eventload()
        statusupdate()
        mainhollyday()

    } catch (err) {
        console.log(err)
        setTimeout(() => {
            boot()
        }, 1000 * 6)

    }
}

module.exports = {
    boot
}