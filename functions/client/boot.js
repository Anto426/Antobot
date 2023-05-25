const info = require("../../package.json");
const { mainhollyday } = require("../count/hollydaycount");
const { statusupdate } = require("./clientstatus");
const { comandload, eventload } = require("./loadc-e");

async function boot() {

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
    comandload()
    eventload()
    statusupdate()
    mainhollyday()


}

module.exports = {
    boot
}