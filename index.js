// new version of antobot 
// v3.2

// variabili 
global.stato = true
global.configs = require("./Config/configs.json")
global.Discord = require('discord.js')
global.fs = require("fs");
global.verifica = false
const { Client, Intents } = require('discord.js');
const { MessageAttachment } = require("discord.js");
const { verifica } = require('./commands/moderation/verifica.js')
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
            client.on(events[0], (...args) => {
                if (stato || events[1] == "commands") {
                    event.execute(...args)
                }
            });
        } else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                let events = event.name.split("-")
                client.on(events[0], (...args) => {
                    if (stato || events[1] == "commands") {
                        event.execute(...args)
                    }
                });
            }
        }
    }
}


client.on("messageCreate", (message) => {

    if (message.content.includes("!react")) {
        message.delete()
        let args = message.content.split(/ +/);
        if (!args[1]) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription("Hai dimenticato di mettere id del messagio")
                .setThumbnail("https://i.imgur.com/5dNAgln.gif")
                .setColor("#fc0303")
            message.channel.send({ embeds: [embed] })
        }
        if (!args[2]) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription("Dove sono le emoji ?")
                .setThumbnail("https://i.imgur.com/5dNAgln.gif")
                .setColor("#fc0303")
            message.channel.send({ embeds: [embed] })
            return
        }
        let idmessage = args[1]
        message.channel.messages.fetch(idmessage).then(msg => {

            for (var i = 2; i < args.length; i++) {
                msg.react(args[i]).catch(() => {})
            }
        }).catch(() => {})
    }
})