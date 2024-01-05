const { check } = require("../check/check");
const { hollyday } = require("../hollyday/hollyday");
const { consolelog } = require("../log/consolelog");
const { status } = require("../status/status");
class loadothermodules {
    constructor() {
        this.check = new check()
        this.status = new status()
        this.hollyday = new hollyday()
    }

    load() {
        this.check.checkallowstatus().then(() => { consolelog("Modulo status caricato", "green"); this.status.init().then(() => { this.status.updatestatus(); this.status.updatestatuseveryfiveminutes(); }).catch(() => { }) }).catch(() => { })
        this.check.checkallowhollyday().then(() => { consolelog("Modulo hollyday caricato", "green"); this.hollyday.init().then(() => { this.hollyday.main() }).catch(() => { }); }).catch(() => { })
    }

}

module.exports = {
    loadothermodules
}