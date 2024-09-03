
const { WriteCommand } = require("../commands/WriteCommand");
const { Loadothermodules } = require("../loadothermodule/loadothermodule");
const { LogStartup } = require("../log/bootlog");
const { BotConsole } = require("../log/botConsole");
const { log } = require("../log/log");
const { Time } = require("./../time/time")
const { ClientInit } = require("./initclient");
const { LoadEventsAndCommand } = require("./loadmodule");
require("dotenv").config()


class Boot {
    constructor() {
        this.BotConsole = new BotConsole()
        this.loadothermodules = new Loadothermodules()
        this.loadEventsAndCommand = new LoadEventsAndCommand()
        this.WriteCommand = new WriteCommand()
        this.time = new Time('Europe/Rome')
        this.ClientInit = new ClientInit()
        this.log = new log()

    }

    loging() {
        client.login(process.env.TOKEN)
            .then(() => {
                try {
                    client.on('ready', async () => {
                        global.Timeon = this.time.getCurrentTimestamp()
                        new LogStartup().log()
                        this.log.init().then(() => {
                            this.log.ready(true)
                        }).catch((err) => {
                            console.log(err)
                            this.BotConsole.log("Errore nell'inizializzare il modulo log", "red")
                        })
                        await this.WriteCommand.commandAllguildonstartup().then(() => {
                            this.loadothermodules.load()
                        })

                    })
                } catch {
                    this.BotConsole.log("Errore il Token non è valido il bot verrà killato", "red")
                }
            })
            .catch(async () => {
                this.BotConsole.log("Errore il Token non è valido il bot verrà killato", "red")
                process.exit(-1);
            })
    }

    on() {
        this.ClientInit.intitialallclientbysettings()
            .then(() => {
                this.loadEventsAndCommand.loadall()
                    .then(() => {
                        this.loging()
                    })
                    .catch(() => {
                        this.loging()
                    })
            })
            .catch(async () => {
                this.BotConsole.log("Errore il client non è stato inizializato correttamete il bot verrà killato", "red")
                process.exit(-1);
            })
    }
}


module.exports = { Boot }