const { consolelog } = require("../log/consolelog")

class writecommand {
    constructor() {
    }

    commandguild(guild) {
        return new Promise((resolve, reject) => {
            consolelog("Scrittura iniziata in " + guild.name, "yellow");

            if (client.basecommands.size === 0) {
                console.log("Err: Non ci sono comandi da registrare", "red");
                return reject(-1);
            }

            let ne = 0;
            const promises = [];

            client.basecommands.forEach(command => {
                if (command.data) {
                    const commandPromise = guild.commands.create(command.data)
                        .catch((err) => {
                            console.log(err)
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
                    if (ne === client.basecommands.size) {
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
        });
    }


    commandallguild() {
        return new Promise((resolve, reject) => {
            let promise = []
            client.guilds.cache.forEach(async (guild) => {
                promise.push(this.commandguild(guild).catch(() => { }))
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