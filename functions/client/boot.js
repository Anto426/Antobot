const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const info = require("../../package.json");
const { comandload } = require("./../../functions/client/loadcommand");
const { comandregister } = require('../../functions/client/comandregister');



async function boot() {

    client.user.setStatus(ActivityType.Custom)
    comandload()
    let commandstring = []
    if (client.commands.size != 0) {
        client.commands.forEach(element => {
            commandstring.push(element)
        });
    } else {
        commandstring.push("Null")
    }

    console.log(`
Welcome To Anto's Bot V${info.version}
    
-Client Name : ${client.user.username}

-Discordjs v: ${info.dependencies['discord.js']}

-Client ID :  ${client.user.id}
    
-N. guild: ${client.guilds.cache.size}
    
-Comand Load: ${client.commands.size}
               
-Token: ${client.token}
    
-Link: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands
    
-Repo: ${info.repository.url}

-------------------------------------------------------------------------------------
    
`,)

    comandregister()
}

module.exports = {
    boot
}
