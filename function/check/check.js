
const { BotConsole } = require("../log/botConsole");
const setting = require("./../../setting/settings.json");

class Check {
    constructor() {
        this.BotConsole = new BotConsole();
    }

    checkValArr(arr, value) {
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(element => {
                    if (element == value) {
                        return resolve(0);
                    }
                });
                return reject(-1);
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare nell'array", "red");
                reject(-1);
            }
        });
    }

    checkValJson(arr, value) {
        return new Promise(async (resolve, reject) => {
            try {
                for (let i in arr) {
                    if (arr[i] == value) {
                        resolve(0);
                    }
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare nel JSON", "red");
                reject(-1);
            }
        });
    }

    checkOwner(arr, id) {
        return new Promise(async (resolve, reject) => {
            this.checkValArr(arr, id)
                .catch(() => {
                    reject(-1);
                })
                .then(() => {
                    resolve(0);
                });
        });
    }

    checkIsBot(idUser, idGuild) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client.guilds.cache.find(x => x.id == idGuild).members.cache.find(x => x.id == idUser).bot) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                this.BotConsole.log("Errore, non ho potuto controllare se è un bot", "red");
                reject(-1);
            }
        });
    }

    checkSOwner(idUser, idGuild) {
        return new Promise(async (resolve, reject) => {
            try {
                if (idUser == client.guilds.cache.find(x => x.id == idGuild).ownerId) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch (err) {
                this.BotConsole.log("Errore, non ho potuto controllare Server owner", "red");
                reject(-1);
            }
        });
    }

    checkPermission(idUser, idGuild, permission) {
        return new Promise(async (resolve, reject) => {
            try {
                if (permission.length != 0) {
                    if (client.guilds.cache.find(x => x.id == idGuild).members.cache.find(x => x.id == idUser).permisions.has(permission)) {
                        resolve(0);
                    } else {
                        reject(-1);
                    }
                } else {
                    reject(-1);
                }
            } catch (err) {
                this.BotConsole.log("Errore, non ho potuto controllare i permessi", "red");
                reject(-1);
            }
        });
    }

    checkIsYou(idUser, otherUserId) {
        return new Promise(async (resolve, reject) => {
            if (idUser, otherUserId) {
                if (idUser == otherUserId) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } else {
                this.BotConsole.log("Errore, non ho potuto controllare se l'utente ha lo stesso id", "red");
                reject(-1);
            }
        });
    }

    checkPosition(idUser, otherUserId, idGuild) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client.guilds.cache.find(x => x.id == idGuild).members.cache.find(x => x.id == otherUserId) && !client.guilds.cache.find(x => x.id == idGuild).members.cache.find(x => x.id == otherUserId).bot && client.guilds.cache.find(x => x.id == idGuild).members.cache.find(x => x.id == idUser).roles.highest.position > client.guilds.cache.find(x => x.id == idGuild).members.cache.find(x => x.id == otherUserId).roles.highest.position) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch (err) {
                this.BotConsole.log("Errore, non ho potuto controllare la posizione", "red");
                reject(-1);
            }
        });
    }

    checkPChannel(idChannel, arr) {
        return new Promise(async (resolve, reject) => {
            this.checkValArr(arr, idChannel)
                .catch(() => {
                    reject(-1);
                })
                .then(() => {
                    resolve(0);
                });
        });
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