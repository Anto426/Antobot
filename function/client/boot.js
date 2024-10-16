
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
                        }).catch(() => { })
                        await this.WriteCommand.commandAllguildonstartup().then(() => {
                            this.loadothermodules.load()
                        })
                    })
                } catch(err) {
                    console.log(err)
                }
            })
            .catch(async (err) => {
                this.BotConsole.log("Errore il Token non è valido il bot verrà killato", "red")
            })
    }

    on() {
        this.ClientInit.intitialallclientbysettings()
            .then(() => {
                this.loadEventsAndCommand.loadall()
                    .then(() => {
                        this.BotConsole.log("Eventi e comandi impostati correttamente", "green")
                        this.loging()
                    })
                    .catch(async () => {
                        await this.BotConsole.log("Errore non ho impostato gli eventi e i comandi il bot verrà killato", "red")
                        process.exit(-1);
                    })
            })
            .catch(async () => {
                this.BotConsole.log("Errore il client non è stato inizializato correttamete il bot verrà killato", "red")
                process.exit(-1);
            })
    }
}


module.exports = { Boot }