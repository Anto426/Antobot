const fs = require("fs")
const { Collection } = require("discord.js");
async function comandload() {

    client.commands = new Collection();
    let commandsFolder
    try {
        commandsFolder = fs.readdirSync("./commands");
    } catch { }
    if (commandsFolder.length != 0) {
        for (const folder of commandsFolder) {
            const commandsFiles = fs.readdirSync(`./commands/${folder}`);
            for (const file of commandsFiles) {
                if (file.endsWith(".js")) {
                    const command = require(`./../../commands/${folder}/${file}`);
                    client.commands.set(command.name, command);
                } else {
                    const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`)
                    for (const file2 of commandsFiles2) {
                        const command = require(`./../../commands/${folder}/${file}/${file2}`);
                        client.commands.set(command.name, command);

                    }
                }
            }
        }
    }
}


function eventload() {
    const eventsFolders = fs.readdirSync('./events');
    let events = []
    for (const folder of eventsFolders) {
        const eventsFiles = fs.readdirSync(`./events/${folder}`)
        for (const file of eventsFiles) {
            if (file.endsWith(".js")) {
                const event = require(`./../../events/${folder}/${file}`);
                let events = event.name.split("-")
                try {
                    client.on(events[0], (...args) => {
                        if (bootstate || events[1] == "statusoff") {
                            event.execute(...args)
                        }
                    });
                } catch { }
            } else {
                const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
                for (const file2 of eventsFiles2) {
                    const event = require(`./../../events/${folder}/${file}/${file2}`);
                    let events = event.name.split("-")
                    try {
                        client.on(events[0], (...args) => {
                            if (bootstate || events[1] == "statusoff") {
                                event.execute(...args)
                            }
                        });
                    } catch { }
                }
            }
        }
    }


    const eventsFilesdis = fs.readdirSync(`./events/Distube/`)
    for (const file of eventsFilesdis) {
        if (file.endsWith(".js")) {
            const event = require(`./../../events/Distube/${file}`);
            distube.on(event.name, (...args) => {
                event.execute(...args)

            })
        }

    }
}




module.exports = {
    comandload,
    eventload
}