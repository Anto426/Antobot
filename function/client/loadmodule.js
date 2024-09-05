const setting = require("../../setting/settings.json");
const { CreateCollection } = require("../dir/createCollection");
const { BotConsole } = require("../log/botConsole");
const { Check } = require("../check/check");

class LoadEventsAndCommand {
    constructor() {
        this.check = new Check();
        this.BotConsole = new BotConsole();
    }

    load(root) {
        return new Promise(async (resolve, reject) => {
            try {
                try {
                    new CreateCollection().createCollection(root, ".js")
                        .then((Collection) => {
                            resolve(Collection)
                        }).catch(() => { reject(-1) })
                } catch (err) {
                    console.log(err)
                    this.BotConsole.log("Errore non ho trovato la cartella:" + root, "red")
                    reject(-1)
                }
            } catch (err) { console.log(err); reject(-1) }
        })
    }

    loadcommand() {
        this.load(process.env.dirbot + setting.base.commands)
            .then((Collection) => {
                client.basecommands = Collection;
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
        this.load(process.env.dirbot + setting.base.events)
            .then((Collection) => {
                client.baseevents = Collection;
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
        this.load(process.env.dirbot + setting.distube.commands)
            .then((Collection) => {
                client.distubecommands = Collection;
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
        this.load(process.env.dirbot + setting.distube.events)
            .then((Collection) => {
                client.distubeevents = Collection;
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
        return new Promise(async (resolve) => {
            try {
                this.loadevents()
                this.loadcommand()
                this.check.checkAllowDistube().then(() => {
                    this.loaddistubecommand()
                    this.loaddistubeevents()
                }).catch(() => { })

                resolve(0)
            } catch (err) {
                new BotConsole().log(err)
                resolve(0)
            }

        })

    }


}



module.exports = {
    LoadEventsAndCommand
}