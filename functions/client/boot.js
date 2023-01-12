const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const info = require("../../package.json");
const { comandload } = require("./../../functions/client/loadcommand");
const { comandregisterallguild } = require('../../functions/client/comandregister');
const { mainhollyday } = require('../hollyday/hollyday');
const { timeon } = require('./timeon');
const { consolelog } = require('../log/console/consolelog');
const { statusupdate } = require('./statusupdate');
bootstate = false


async function boot() {

    statusupdate()

    comandload()

    consolelog(`
Welcome To Anto's Bot V${info.version}
    
-Client Name : ${client.user.username}

-Discordjs v: ${info.dependencies['discord.js']}

-Client ID :  ${client.user.id}
    
-N. guild: ${client.guilds.cache.size}
    
-Comand Load: ${client.commands.size}
               
-Token: ${client.token}
    
-Link: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands
    
-Repo: ${info.repository.url}

-------------------------------------------------------------------------------------
    
`,)

    timeon()
    setTimeout(() => {
        bootstate = true
        comandregisterallguild()
        mainhollyday()
    }, 1000 * 20);

}

module.exports = {
    boot
}
