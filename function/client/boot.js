
const { WriteCommand } = require("../commands/WriteCommand");
const { Loadothermodules } = require("../loadothermodule/loadothermodule");
const { Info } = require("../log/bootlog");
const { BotConsole } = require("../log/botConsole");
const { Time } = require("./../time/time")
const { ClientInit } = require("./initclient");
const { LoadEventsAndCommand } = require("./loadEventsAndCommand");
require("dotenv").config()


class Boot {
    constructor() {
    }

    loging() {
        client.login(process.env.TOKEN)
            .then(() => {
                try {
                    client.on('ready', async () => {
                        global.Timeon = new Date().getTime()
                        new Info().log()
                        await new WriteCommand().commandAllguildonstartup().then(() => {
                            new Loadothermodules().load()
                        })

                    })
                } catch {
                    new BotConsole().log("Errore il Token non è valido il bot verrà killato", "red")
                }
            })
            .catch(async () => {
                await new BotConsole().log("Errore il Token non è valido il bot verrà killato", "red")
                process.exit(-1);
            })
    }

    on() {
        new Time('Europe/Rome').setTimezone()
        new ClientInit().intitialallclientbysettings()
            .then(() => {
                new LoadEventsAndCommand().loadall()
                    .then(() => {
                        this.loging()
                    })
                    .catch(() => {
                        this.loging()
                    })

            })
            .catch(async () => {
                await new BotConsole().log("Errore il client non è stato inizializato correttamete il bot verrà killato", "red")
                process.exit(-1);
            })
    }
}


module.exports = { Boot }