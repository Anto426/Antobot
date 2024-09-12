const setting = require("../../setting/settings.json");
const { CreateCollection } = require("../dir/createCollection");
const { BotConsole } = require("../log/botConsole");
const { Check } = require("../check/check");

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
                        client[namecollection] = Collection;
                        resolve(0)
                    }).catch(() => { reject(-1) })
            } else {
                this.BotConsole.log("Errore non ho trovato la root", "red")
                reject(-1)
            }
        })
    }

    loadcommand() {
        this.load("basecommands", process.env.dirbot + setting.base.commands)
            .then(() => {
                client.basecommands.forEach(x => {
                    x.type = "Base"
                });
            })
            .catch((err) => {
                console.log(err)
                this.BotConsole.log("Errore non ho caricato i camandi:", "red")
            })
    }

    loadevents() {
        this.load("baseevents", process.env.dirbot + setting.base.events)
            .then(() => {
                client.baseevents.forEach(x => {
                    if (x.allowevents)
                        client.on(x.typeEvent, (...args) => {
                            x.execute(...args)
                        });
                });
            })
            .catch((err) => {
                console.log(err)
                this.BotConsole.log("Errore non ho caricato gli eventi", "red")
            })

    }

    loaddistubecommand() {
        this.load("distubecommands", process.env.dirbot + setting.distube.commands)
            .then(() => {
                client.distubecommands.forEach(x => {
                    x.type = "Distube"
                });
            })
            .catch((err) => {
                console.log(err)
                this.BotConsole.log("Errore non ho caricato i camandi", "red")
            })
    }

    loaddistubeevents() {
        this.load("distubeevents", process.env.dirbot + setting.distube.events)
            .then(() => {
                client.distubeevents.forEach(x => {
                    if (x.allowevents)
                        distube.on(x.typeEvent, (...args) => {
                            x.execute(...args)
                        });
                });
            })
            .catch((err) => {
                console.log(err)
                this.BotConsole.log("Errore non ho caricato gli eventi di distube", "red")
            })
    }


    loadall() {
        return new Promise(async (resolve, reject) => {
            try {
                this.loadevents()
                this.loadcommand()
                this.check.checkAllowDistube().then(() => {
                    this.loaddistubecommand()
                    this.loaddistubeevents()
                }).catch(() => {})
                resolve(0)
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