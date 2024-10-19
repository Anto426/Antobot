const { Cjson } = require("../file/json");
const { MathClass } = require("../math/MathClass");
const setting = require("../../setting/settings.json");
const { BotConsole } = require("../log/botConsole");

class Status {
    constructor() {
        this.statusJson = {};
        this.json = new Cjson();
        this.math = new MathClass();
        this.botConsole = new BotConsole();
    }

    updateStatus() {

        this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[4], process.env.GITTOKEN).then((data) => {
            let randomstatus = data.status[this.math.getRandomNumber(0, data.status.length - 1)];
            client.user.setPresence({
                activities: [{
                    name: randomstatus.description,
                    type: randomstatus.type,
                }],
                status: 'online'
            });
            this.botConsole.log("Status aggiornato: Nuovo status" + randomstatus.description, "green");
        }).catch((err) => {
            console.log(err);
            this.botConsole.log("Errore nel Aggiornare lo status", "red");
        });
    }

    updateStatusEveryFiveMinutes() {
        setInterval(() => {
            this.updateStatus();
        }, 5000 * 60);
    }
}

module.exports = {
    Status
};