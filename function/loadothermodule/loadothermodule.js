const { Check } = require("../check/check");
const { Holiday } = require("../hollyday/hollyday");
const { BotConsole } = require("../log/botConsole");
const { Status } = require("../status/status");

class Loadothermodules {
    constructor() {
        this.check = new Check()
        this.status = new Status()
        this.holiday = new Holiday()
        this.BotConsole = new BotConsole()
    }

    load() {
        this.check.checkAllowStatus().then(() => { this.BotConsole.log("Modulo status caricato", "green"); this.status.updateStatus(); this.status.updateStatusEveryFiveMinutes() }).catch(() => { this.BotConsole.log("Modulo status non caricato", "red") })
        this.check.checkAllowHoliday().then(() => { this.BotConsole.log("Modulo hollyday caricato", "green"); this.holiday.init().then(() => { this.holiday.main() }).catch(() => { }); }).catch((err) => { console.log(err); this.BotConsole.log("Modulo hollyday non caricato", "red") })
    }

}

module.exports = {
    Loadothermodules
}