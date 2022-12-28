const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const info = require("../../package.json");
const { comandload } = require('../client/loadcommand');

function onlinef() {

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

-N. guild: ${client.guilds.cache.size}

-Comand Load: ${client.commands.size}
{
${commandstring.toString()}
}
           
-Token: ${client.token}

-Link: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands

-Repo: ${info.repository.url}

`,)
}
module.exports = {
    onlinef: onlinef
}