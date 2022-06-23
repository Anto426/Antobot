// new version of antobot 
// v3.2

// variabili 
global.configs = require("./Config/configs.json")
global.Discord = require('discord.js')
global.fs = require("fs");
const { Client, Intents } = require('discord.js');
const { MessageAttachment } = require("discord.js");
global.client = new Discord.Client({
    intents: 32767,
    partials: ['USER', 'REACTION', 'MESSAGE']
});
try {
    require("dotenv").config()
} catch {}



// code 

client.login(process.env.TOKEN)

//comands
client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        } else {
            const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`)
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/${folder}/${file}/${file2}`);
                client.commands.set(command.name, command);
            }
        }
    }
}
//events
const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)
    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            client.on(event.name, (...args) => {

                event.execute(...args)

            });
        } else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}