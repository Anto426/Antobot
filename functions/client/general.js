const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const info = require("./../../package.json")
function onlinef() {
 
    client.user.setStatus(ActivityType.Custom)
 
    console.log(`
           Welcome To Anto's Bot V${info.version}                                                                                                                      

           -N. guild: ${client.guilds.cache.size}                                                                                              

           -Link: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands        

           -Comand Load: ${client.token}
           
           -Token: ${client.token}

    `,)
}
module.exports = {
    onlinef: onlinef
}