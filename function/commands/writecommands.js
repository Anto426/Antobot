const { consolelog } = require("../log/consolelog")

class writecommand {
    constructor() {
    }

    commandguild(guild) {
        return new Promise((resolve, reject) => {
            let ne = 0
            consolelog("Scrittura iniziata in " + guild.name);
            if (client.commands.size == 0) {
                consolelog("Err: Non ci sono comandi da registrare");
                reject(-1);
            }

            new Promise((resolve1, reject1) => {
                try {
                    client.commands.forEach(command => {
                        if (command.data) {
                            guild.commands.create(command.data)
                                .catch(() => {
                                    consolelog("Errore: non ho potuto registrare il comando:" + command.name);

                                });
                        } else {
                            consolelog("Errore: non ho trovato la sezione data nel comando :" + command.name);
                            ne++;
                        }
                    });

                    if (ne != client.commands.size) {
                        resolve1(0);
                    } else {
                        reject1(-1)
                    }

                } catch {
                    reject1(-1)
                }


            })
                .then(() => {
                    consolelog("Scrittura dei comandi avvenuta corretamente in " + guild.name)
                    resolve(0);

                })

                .catch(() => {
                    consolelog("Err :Imposibile completare la scrittura dei comandi" + guild.name)
                    reject(-1)
                })




        });
    }

    commandallguild() {

        client.guilds.cache.forEach(async (guild) => {
            await this.commandguild(guild).catch(() => { })
        });

    }

    async commandoneguild(guild) {
        await this.commandguild(guild).catch(() => { })


    }
}

module.exports = {
    writecommand
}