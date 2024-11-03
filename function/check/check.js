
const { BotConsole } = require("../log/botConsole");
const setting = require("../../setting/settings.json");

class Check {
    constructor() {
        this.BotConsole = new BotConsole();
    }

    checkAllowOpenAI() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.openai) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare la variabile", "red");
                reject(-1);
            }
        });
    }

    checkAllowDistube() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.music) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare la variabile", "red");
                reject(-1);
            }
        });
    }

    checkAllowHoliday() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.holiday) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare la variabile", "red");
                reject(-1);
            }
        });
    }

    checkAllowStatus() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.status) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare la variabile", "red");
                reject(-1);
            }
        });
    }

    checkAllowCaptcha() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.captcha) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare la variabile", "red");
                reject(-1);
            }
        });
    }
}

module.exports = {
    Check
};