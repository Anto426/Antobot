// new version of antobot 
// v4.0

// variabili 
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { MessageAttachment } = require("discord.js");
let stato = true
let settings = require("./Settings/settings.json")
let Discord = require('discord.js')
let owner = require("./Settings/owner.json")
let fs = require("fs");
let verifica = false

let client = new Discord.Client({
    intents: 32767,
    partials: [Partials.User, Partials.Reaction, Partials.Message]
});
module.exports = {
    stato: stato,
    settings: settings,
    Discord: Discord,
    fs: fs,
    verifica: verifica,
    client: client,
    owner: owner,
}
try {
    require("dotenv").config()
} catch { }

let update = require("./function/update/statusupdate")

// code 

client.login(process.env.TOKEN)

//comands
client.commands = new Discord.Collection();
let commandsFolder = fs.readdirSync("./commands");
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
let events = []
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)
    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            let events = event.name.split("-")
            try {
                client.on(events[0], (...args) => {
                    if (stato || events[1] == "commands") {
                        event.execute(...args)
                    }
                });
            } catch { }
        } else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                let events = event.name.split("-")
                try {
                    client.on(events[0], (...args) => {
                        if (stato || events[1] == "commands") {
                            event.execute(...args)
                        }
                    });
                } catch { }
            }
        }
    }
}

setInterval(() => {
    update.activity()

}, 1000 * 60)