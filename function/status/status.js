const { ActivityType } = require("discord.js")
const { Cjson } = require("../json/json")
const { consolelog } = require("../log/consolelog")
const { Cmath } = require("../math/math")
const setting = require("./../../setting/settings.json")
class status {
    constructor() {
        this.stausjson = {}
        this.json = new Cjson
        this.math = new Cmath
    }
    init() {
        return new Promise(async (resolve, reject) => {

            await this.json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[4], client.gitToken).then((json) => { this.stausjson = json; resolve(0) }).catch(() => { consolelog("Errore nel inizializare " + setting.configjson.online.name[4], "red"); reject(-1) })

        })

    }

    updatestatus() {

        try {
            client.user.setPresence({
                activities: [{
                    name: this.stausjson.status[this.math.getRandomNumber(0, this.stausjson.status.length - 1)],
                    type: ActivityType.Playing,
                }],
                status: 'online'
            });
        } catch (err) {
            consolelog("Errore nel aggiornare lo status :" + err, "red")
        }
    }

    updatestatuseveryfiveminutes() {
        setInterval(() => {
            this.updatestatus()
        }, 5000 * 60)

    }


}
module.exports = {
    status
}