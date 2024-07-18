
const { ActivityType } = require("discord.js");
const { Cjson } = require("../file/json");
const { MathClass } = require("../math/MathClass");
const setting = require("./../../setting/settings.json");
const { BotConsole } = require("../log/botConsole");

class Status {
    constructor() {
        this.statusJson = {};
        this.json = new Cjson();
        this.math = new MathClass();
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            try {
                const json = await this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[4], process.env.GITTOKEN);
                this.statusJson = json;
                resolve(0);
            } catch (error) {
                new BotConsole().log("Errore nell'inizializzare " + setting.configjson.online.name[4], "red");
                reject(-1);
            }
        });
    }

    updateStatus() {
        try {
            client.user.setPresence({
                activities: [{
                    name: this.statusJson.status[this.math.getRandomNumber(0, this.statusJson.status.length - 1)],
                    type: ActivityType.Playing,
                }],
                status: 'online'
            });
        } catch (error) {
            new BotConsole().log("Errore nell'aggiornare lo status: " + error, "red");
        }
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