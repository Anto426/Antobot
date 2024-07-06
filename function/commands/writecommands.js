const { Collection } = require("discord.js");
const { consolelog } = require("../log/consolelog")

class writecommand {
    constructor() {
    }

    commandguild(guild) {
        return new Promise((resolve, reject) => {

            this.comanddeleteguild(guild).then(() => {

                consolelog("Scrittura iniziata in " + guild.name, "yellow");

                client.comamndg = new Collection([
                    ...client.basecommands,
                    ...client.distubecommands,
                ])

                if (client.comamndg.size === 0) {
                    consolelog("Err: Non ci sono comandi da registrare", "red");
                    return reject(-1);
                }

                let ne = 0;
                const promises = [];




                client.comamndg.forEach(command => {
                    if (command.data) {
                        const commandPromise = guild.commands.create(command.data)
                            .catch((err) => {
                                consolelog("Errore: non ho potuto registrare il comando:" + command.name, "red");
                            });
                        promises.push(commandPromise);
                    } else {
                        consolelog("Errore: non ho trovato la sezione data nel comando: " + command.name, "red");
                        ne++;
                    }
                });

                Promise.all(promises)
                    .then(() => {
                        if (ne === client.comamndg.size) {
                            consolelog("Nessun comando registrato correttamente in " + guild.name, "red");
                            return reject(-1);
                        }
                        consolelog("Scrittura dei comandi avvenuta correttamente in " + guild.name, "green");
                        resolve(0);
                    })
                    .catch(() => {
                        consolelog("Err: Impossibile completare la scrittura dei comandi in " + guild.name, "red");
                        reject(-1);
                    });
            }).catch(() => { reject(-1) })


        });
    }

    comanddeleteguild(guild) {

        return new Promise(async (resolve, reject) => {
            try {
                consolelog('Cancellazione dei comandi avviata in ' + guild.name, "yellow");
                const promises = [];
                let commands = await guild.commands.fetch();
                if (commands.size != 0) {
                    for (let command of commands.values()) {
                        promises.push(command.delete());
                    }
                    Promise.all(promises).then(() => {
                        consolelog('Slash coomand Cancellati in ' + guild.name, "green");
                        resolve(0)
                    }).catch((err) => { })
                } else {
                    consolelog("Errore non sono presenti slash command da canellare in " + guild.name, "red")
                    resolve(0)
                }

            } catch (err) {
                consolelog("Errore Impossibile cancellare gli slash command", "red")
                reject(-1)
            }
        })

    }

    commandallguild() {
        return new Promise((resolve, reject) => {
            let promise = []

            client.guilds.cache.forEach(async (guild) => {
                await promise.push(this.commandguild(guild).catch(() => { }))
            });
            Promise.all(promise).then(() => {
                resolve(0)
            }).catch(() => {
                reject(-1)
            })


        })


    }

    async commandoneguild(guild) {
        await this.commandguild(guild).catch(() => { })
    }
}

module.exports = {
    writecommand
}