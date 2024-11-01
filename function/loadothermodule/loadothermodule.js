
const { serverUpdate } = require("../../webhook/serverUpdate");
const { Check } = require("../check/check");
const { Holiday } = require("../hollyday/hollyday");
const { BotConsole } = require("../log/botConsole");
const { Status } = require("../status/status");

class Loadothermodules {
    constructor() {
        this.BotConsole = new BotConsole()
        this.check = new Check()
        this.serverUpdate = new serverUpdate()
    }


    load() {
        client.holidaymodule = new Holiday()
        client.statusmodule = new Status()
        this.serverUpdate.init().then(() => { this.BotConsole.log("Server inizializzato", "green"); this.serverUpdate.StartServer() }).catch(() => { this.BotConsole.log("Server non inizializzato", "red") })
        this.check.checkAllowStatus().then(() => { this.BotConsole.log("Modulo status caricato", "green"); client.statusmodule.updateStatus(); client.statusmodule.updateStatusEveryFiveMinutes() }).catch(() => { this.BotConsole.log("Modulo status non caricato", "red") })
        this.check.checkAllowHoliday().then(() => { this.BotConsole.log("Modulo hollyday caricato", "green"); client.holidaymodule.init().then(() => { client.holidaymodule.main() }).catch(() => { }); }).catch((err) => { console.log(err); this.BotConsole.log("Modulo hollyday non caricato", "red") })
    }

}

module.exports = {
    Loadothermodules
}