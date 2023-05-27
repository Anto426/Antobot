const info = require("../../package.json");
const { mainhollyday } = require("../count/hollydaycount");
const { statusupdate } = require("./clientstatus");
const { comandregisterguild } = require("./comandregister");
const { eventload } = require("./loadc-e");
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
        timeon()

        comandregisterguild()
        eventload()
        statusupdate()
        mainhollyday()

    } catch (err) { console.log(err) }
}

module.exports = {
    boot
}