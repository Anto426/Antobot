
const { BotConsole } = require("../log/botConsole");

class WriteCommand {
    constructor() {
        this.BotConsole = new BotConsole();
    }

    async commandGuild(guild) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.commandDeleteGuild(guild).then(() => {

                    new BotConsole().log("Scrittura iniziata in " + guild.name, "yellow");

                    const promises = [];

                    client.commandg.forEach(command => {
                        if (command.data) {
                            const commandPromise = guild.commands.create(command.data)
                                .catch(err => {
                                    console.error(err);
                                    this.BotConsole.log("Errore: non ho potuto registrare il comando: " + command.name, "red");
                                });
                            promises.push(commandPromise);
                        } else {
                            this.BotConsole.log("Errore: non ho trovato la sezione data nel comando: " + command.name, "red");
                        }
                    });

                    Promise.allSettled(promises).then(results => {
                        const successfulCount = results.filter(result => result.status === "fulfilled").length;

                        if (successfulCount === client.commandg.size) {
                            this.BotConsole.log("Scrittura dei comandi avvenuta correttamente in " + guild.name, "green");
                            resolve(0);
                        } else if (successfulCount > 0) {
                            this.BotConsole.log("Scrittura dei comandi avvenuta con errori in " + guild.name, "yellow");
                            resolve(0);
                        } else {
                            this.BotConsole.log("Errore: non ho potuto scrivere i comandi in " + guild.name, "red");
                            reject(-1);
                        }
                    }).catch(err => {
                        console.error(err);
                        this.BotConsole.log("Errore durante la scrittura dei comandi in " + guild.name, "red");
                        reject(-1);
                    });

                }).catch(() => { reject(-1); });


            } catch (err) {
                this.BotConsole.log("Errore nella cancellazione dei comandi in " + guild.name, "red");
                reject(-1);
            }
        });
    }

    async commandDeleteGuild(guild) {
        return new Promise(async (resolve, reject) => {
            try {
                this.BotConsole.log("Cancellazione dei comandi in " + guild.name, "yellow");

                let commands = await guild.commands.fetch();

                if (commands.size === 0) {
                    resolve(0);
                    return;
                }

                let deletePromises = [];

                commands.forEach(command => {
                    const deletePromise = command.delete().catch(() => {
                        this.BotConsole.log(`Errore nella cancellazione del comando ${command.name} in ${guild.name}`, "red");
                    });
                    deletePromises.push(deletePromise);
                });

                Promise.allSettled(deletePromises).then(results => {
                    const successfulDeletes = results.filter(result => result.status === "fulfilled").length;

                    if (successfulDeletes === commands.size) {
                        this.BotConsole.log(`Cancellazione dei comandi completata in ${guild.name}`, "green");
                        resolve(0);
                    } else if (successfulDeletes > 0) {
                        this.BotConsole.log(`Cancellazione dei comandi completata con errori in ${guild.name}`, "yellow");
                        resolve(-1);
                    } else {
                        this.BotConsole.log(`Errore: non ho potuto cancellare i comandi in ${guild.name}`, "red");
                        reject(-1);
                    }
                }).catch(() => {
                    this.BotConsole.log(`Errore durante la cancellazione dei comandi in ${guild.name}`, "red");
                    reject(-1);
                });

            } catch (err) {
                this.BotConsole.log(err);
                reject(-1);
            }
        });
    }

    commandallguild() {
        return new Promise((resolve, reject) => {

            let promises = [];

            client.guilds.cache.forEach(guild => {
                const promise = this.commandGuild(guild).catch(() => {
                    this.BotConsole.log(`Errore nella registrazione dei comandi per la gilda ${guild.name}`, "red");
                });
                promises.push(promise);
            });

            Promise.allSettled(promises).then(results => {
                const registerguild = results.filter(result => result.status === "fulfilled").length;
                if (registerguild === client.guilds.cache.size) {
                    this.BotConsole.log("Scrittura dei comandi in tutte le gilde completata", "green");
                    resolve(0);
                } else if (registerguild > 0) {
                    this.BotConsole.log("Scrittura dei comandi in tutte le gilde completata con errori", "yellow");
                    reject(-1);
                } else {
                    this.BotConsole.log("Errore: non ho potuto scrivere i comandi in tutte le gilde", "red");
                    reject(-1);
                }
            }).catch((err) => {
                console.error(err);
                this.BotConsole.log("Errore durante la scrittura dei comandi nelle gilde", "red");
                reject(-1);
            });

        });
    }


    async commandAllguildonstartup() {
        return new Promise(async (resolve) => {

            if (!client.distubecommands && !client.basecommands) {
                this.BotConsole.log("Errore: nessun comando da registrare", "red");
                resolve(0)
            }

            let promises = [];

            for (let guild of client.guilds.cache.values()) {
                let commandchange = false;
                let commands = await guild.commands.fetch();

                if (commands.size === client.commandg.size) {
                    client.commandg.some(command => {
                        if (commands.find(x => x.data === command.data)) {
                            commandchange = true;
                            return true;
                        }
                    });
                } else {
                    commandchange = true;
                }

                if (commandchange) {
                    promises.push(this.commandGuild(guild));
                } else {
                    this.BotConsole.log(`Nessun comando da registrare in ${guild.name}`, "yellow");
                }
            }

            if (promises.length === 0) {
                this.BotConsole.log("Nessun comando da registrare in tutte le gilde", "yellow");
                resolve(0);
            } else {
                Promise.allSettled(promises).then(results => {
                    const fulfilledCount = results.filter(result => result.status === "fulfilled").length;

                    if (fulfilledCount === promises.length) {
                        this.BotConsole.log("Scrittura dei comandi in tutte le gilde completata", "green");
                        resolve(0);
                    } else if (fulfilledCount > 0) {
                        this.BotConsole.log("Scrittura dei comandi in tutte le gilde completata con errori", "yellow");
                        resolve(0);
                    } else {
                        this.BotConsole.log("Errore: non ho potuto scrivere i comandi in tutte le gilde", "red");
                        reject(0);
                    }

                });
            }
        });
    }

}

module.exports = {
    WriteCommand
}