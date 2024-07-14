const { Check } = require("../check/check");
const { Holiday } = require("../hollyday/hollyday");
const { Status } = require("../status/status");

class Loadothermodules {
    constructor() {
        this.check = new Check()
        this.status = new Status()
        this.holiday = new Holiday()
    }

    load() {
        this.check.checkAllowStatus().then(() => { new BotConsole().log("Modulo status caricato", "green"); this.status.init().then(() => { this.status.updateStatus(); this.status.updateStatusEveryFiveMinutes(); }).catch(() => { }) }).catch(() => { })
        this.check.checkAllowHoliday().then(() => { new BotConsole().log("Modulo hollyday caricato", "green"); this.holiday.init().then(() => { this.holiday.main() }).catch(() => { }); }).catch(() => { })
    }

}

module.exports = {
    Loadothermodules
}