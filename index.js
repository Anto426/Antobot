// New version of Anto bot v 5.0 
// const 
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const { intclient } = require('./functions/client/intclient');
const { tokenload } = require('./functions/client/tokenload');
const { nexhollyday } = require('./functions/hollyday/hollyday');

//client 
intclient()
// token 
try {
    require("dotenv").config()
} catch { }

tokenload(process.env.TOKEN)
// file config

let stato = true


module.exports = {
    stato
}



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





