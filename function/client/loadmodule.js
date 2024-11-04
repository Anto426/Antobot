const setting = require("../../setting/settings.json");
const { CreateCollection } = require("../dir/createCollection");
const { BotConsole } = require("../log/botConsole");
const { Check } = require("../check/check");
const { Collection } = require("discord.js");
const { ErrorManager } = require("../err/errormenager");

class LoadEventsAndCommand {
    constructor() {
        this.check = new Check();
        this.BotConsole = new BotConsole();
    }

    load(namecollection, root) {
        return new Promise(async (resolve, reject) => {
            if (root) {
                new CreateCollection().createCollection(root, ".js")
                    .then((Collection) => {
                        let color = Collection.size > 0 ? "green" : "red"
                        client[namecollection] = Collection;
                        this.BotConsole.log("Caricato " + client[namecollection].size + " file di " + namecollection, color)
                        resolve(0)
                    }).catch(() => { reject(-1) })
            } else {
                this.BotConsole.log("Errore non ho trovato la root", "red")
                reject(-1)
            }
        })
    }

    loadcommand() {
        return new Promise(async (resolve, reject) => {
            this.load("basecommands", process.env.dirbot + setting.base.commands)
                .then(() => {
                    client.basecommands.forEach(x => {
                        x.type = "Base"
                    });
                    resolve(0)
                })
                .catch(() => { reject(-1) })
        })

    }

    loadevents() {

        return new Promise(async (resolve, reject) => {
            this.load("baseevents", process.env.dirbot + setting.base.events)
                .then(() => {
                    client.baseevents.forEach(x => {
                        if (x.allowevents)
                            client.on(x.typeEvent, (...args) => {
                                let errorManager = new ErrorManager();
                                x.execute(...args).catch((err) => { errorManager.replyError(err[0], err[1]) })
                            });
                        resolve(0)
                    });
                })
                .catch(() => { reject(-1) })

        })

    }

    loadbuttonbase() {
        return new Promise(async (resolve, reject) => {
            this.load("basebutton", process.env.dirbot + setting.base.button)
                .then(() => {
                    resolve(0)
                })
                .catch(() => {
                    reject(-1)
                })

        })
    }

    loaddistubecommand() {
        return new Promise(async (resolve, reject) => {
            this.load("distubecommands", process.env.dirbot + setting.distube.commands)
                .then(() => {
                    client.distubecommands.forEach(x => {
                        x.type = "Distube"
                    });
                    resolve(0)
                })
                .catch(() => {
                    reject(-1)
                })
        })
    }

    loaddistubeevents() {
        return new Promise(async (resolve, reject) => {
            this.load("distubeevents", process.env.dirbot + setting.distube.events)
                .then(() => {
                    client.distubeevents.forEach(x => {
                        if (x.allowevents)
                            distube.on(x.typeEvent, (...args) => {
                                x.execute(...args)
                            });
                    });
                    resolve(0)
                })
                .catch(() => { reject(-1) })
        })


    }

    loadbuttondistube() {
        return new Promise(async (resolve, reject) => {
            this.load("distubebutton", process.env.dirbot + setting.distube.button)
                .then(() => { resolve(0) })
                .catch(() => { reject(-1) })
        })
    }

    createPrimaryCollection() {

        return new Promise(async (resolve, reject) => {

            try {
                if (!client.distubecommands) {
                    client.commandg = client.basecommands;
                } else {
                    client.commandg = new Collection([
                        ...client.basecommands,
                        ...client.distubecommands,
                    ]);
                }

                if (!client.distubebutton) {

                    client.buttong = client.basebutton;
                } else {
                    client.buttong = new Collection([
                        ...client.basebutton,
                        ...client.distubebutton,
                    ]);
                }
                resolve(0)

            } catch (err) {
                console.log(err)
                reject(-1)
            }


        })

    }


    loadall() {
        return new Promise(async (resolve, reject) => {
            try {

                let promise = []

                promise.push(this.loadcommand().catch(() => { }))
                promise.push(this.loadevents().catch(() => { }))
                promise.push(this.loadbuttonbase().catch(() => { }))
                this.check.checkAllowDistube().then(() => {
                    promise.push(this.loaddistubecommand().catch(() => { }))
                    promise.push(this.loaddistubeevents().catch(() => { }))
                    promise.push(this.loadbuttondistube().catch(() => { }))
                }).catch(() => { })
                Promise.all(promise).then(() => {
                    this.BotConsole.log("Tutti i file sono stati caricati", "green")
                    this.createPrimaryCollection().then(() => {
                        this.BotConsole.log("Collezioni create", "green")
                        resolve(0)
                    }).catch(() => {
                        this.BotConsole.log("Errore non ho incorporato gli eventi e i comandi", "red")
                        reject(-1)
                    })
                }).catch(() => {
                    this.BotConsole.log("Errore non ho incorporato gli eventi e i comandi", "red")
                    reject(-1)
                })

            } catch (err) {
                console.log("Errore", err)
                this.BotConsole.log("Errore non ho incorporato gli eventi e i comandi", "red")
                reject(-1)
            }

        })

    }


}



module.exports = {
    LoadEventsAndCommand
}