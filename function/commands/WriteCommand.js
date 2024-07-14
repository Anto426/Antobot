
const { Collection } = require("discord.js");
const { BotConsole } = require("../log/botConsole");

class WriteCommand {
    constructor() {
    }

    commandGuild(guild) {
        return new Promise((resolve, reject) => {

            this.commandDeleteGuild(guild).then(() => {

                new BotConsole().log("Scrittura iniziata in " + guild.name, "yellow");



                if (client.commandg.size === 0) {
                    new BotConsole().log("Err: Non ci sono comandi da registrare", "red");
                    return reject(-1);
                }

                let ne = 0;
                const promises = [];




                client.commandg.forEach(command => {
                    if (command.data) {
                        const commandPromise = guild.commands.create(command.data)
                            .catch((err) => {
                                new BotConsole().log("Errore: non ho potuto registrare il comando:" + command.name, "red");
                            });
                        promises.push(commandPromise);
                    } else {
                        new BotConsole().log("Errore: non ho trovato la sezione data nel comando: " + command.name, "red");
                        ne++;
                    }
                });

                Promise.all(promises)
                    .then(() => {
                        if (ne === client.commandg.size) {
                            new BotConsole().log("Nessun comando registrato correttamente in " + guild.name, "red");
                            return reject(-1);
                        }
                        new BotConsole().log("Scrittura dei comandi avvenuta correttamente in " + guild.name, "green");
                        resolve(0);
                    })
                    .catch(() => {
                        new BotConsole().log("Err: Impossibile completare la scrittura dei comandi in " + guild.name, "red");
                        reject(-1);
                    });
            }).catch(() => { reject(-1) })


        });
    }

    commandDeleteGuild(guild) {

        return new Promise(async (resolve, reject) => {
            try {
                new BotConsole().log('Cancellazione dei comandi avviata in ' + guild.name, "yellow");
                const promises = [];
                let commands = await guild.commands.fetch();
                if (commands.size != 0) {
                    for (let command of commands.values()) {
                        promises.push(command.delete());
                    }
                    Promise.all(promises).then(() => {
                        new BotConsole().log('Slash command cancellati in ' + guild.name, "green");
                        resolve(0)
                    }).catch(() => { })
                } else {
                    new BotConsole().log("Errore non sono presenti slash command da cancellare in " + guild.name, "red")
                    resolve(0)
                }

            } catch (err) {
                new BotConsole().log("Errore Impossibile cancellare gli slash command", "red")
                reject(-1)
            }
        })

    }

    commandallguild() {
        return new Promise((resolve, reject) => {
            let promise = []

            client.guilds.cache.forEach(async (guild) => {
                await promise.push(this.commandGuild(guild).catch(() => { }))
            });
            Promise.all(promise).then(() => {
                resolve(0)
            }).catch(() => {
                reject(-1)
            })


        })


    }


    commandAllguildonstartup() {
        return new Promise((resolve) => {
            client.commandg = new Collection([
                ...client.basecommands,
                ...client.distubecommands,
            ])


            let countguild = 0;
            let counterr = 0;
            let ncommand = client.commandg.size;
            client.guilds.cache.forEach(async (guild) => {
                let count = 0;
                let commands = await guild.commands.fetch();
                for (let i = 0; i < ncommand; i++) {
                    if (commands.find(x => x.name === client.commandg.at(i).name)) {
                        count++;
                    } else break;
                }

                if (count != ncommand) {
                    this.commandDeleteGuild(guild).then(() => {
                        this.commandOneGuild(guild).then(() => { countguild++ }).catch(() => { counterr++ })
                    }).catch(() => { })
                }
            })

            if (countguild === client.guilds.cache.size) {
                new BotConsole().log("Comandi inizializzati correttamente in tutti i server", "green")
                resolve(0)
            } if (countguild >= 0) {
                new BotConsole().log("Comandi inizializzati correttamente in " + countguild + " server", "green")
                resolve(0)
            } else {
                new BotConsole().log("Non devo inizializzare nessun comando", "yellow");
                resolve(0)
            }

        })
    }

    async commandOneGuild(guild) {
        await this.commandGuild(guild).catch(() => { })
    }
}

module.exports = {
    WriteCommand
}