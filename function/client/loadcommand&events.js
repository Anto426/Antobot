const fs = require("fs")
const { Collection } = require("discord.js");
const dirpatch = require("./../../setting/settings.json");
const { collectioncrete } = require("../dir/dirfunction");
const { consolelog } = require("../log/consolelog");


class loadeventsandcommand {
    constructor() { }

    load(namecollect, dir) {

        return new Promise(async (resolve, reject) => {
            try {

                client[namecollect] = new Collection()
                try {
                    let commandF = fs.readdirSync(dir)
                    if (commandF.length != 0)
                        resolve(await collectioncrete(client[namecollect], dir, commandF, "js"))
                    else
                        resolve(0)
                } catch (err) {
                    console.log(err)
                    consolelog("Errore non ho trovato la cartella:" + dir)
                    reject(-1)
                }


            } catch (err) { reject(err) }
        })
    }

    loadcommand() {

        this.load("commands", dirpatch.commands)
            .then(() => {
            })
            .catch(() => { consolelog("Errore non ho caricato i camandi") })
    }

    loadevents() {
        this.load("events", dirpatch.events)
            .then(() => {
                client.events.forEach(x => {
                    client.on(x.name, (...args) => {
                        x.execute(...args)
                    });
                });
            })
            .catch((err) => {
                consolelog(err)
                consolelog("Errore non ho caricato gli eventi")
                client.events.delete();
            })

    }

    loadall() {
        return new Promise(async (resolve, reject) => {
            try {
                this.loadcommand()
                this.loadevents()
                resolve(0)
            } catch {
                reject(-1)
            }

        })

    }


}



module.exports = {
    loadeventsandcommand
}