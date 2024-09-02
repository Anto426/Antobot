
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

    checkIsBot(user) {
        return new Promise(async (resolve, reject) => {
            try {
                if (user.bot) {
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

    checkPermission(User, permission) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(permission);
                if (permission.size != 0) {
                    let permcount = 0;
                    permission.forEach(element => {
                        if (User.permissions.has(element)) {
                            permcount++;
                        }
                    });
                    if (permcount == permission.length) {
                        resolve(0);
                    } else {
                        reject(-1);
                    }
                } else {
                    resolve(0);
                }
            } catch (err) {
                console.log(err);
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

    checkPosition(User, otherUser) {
        return new Promise(async (resolve, reject) => {
            try {




                const UserhighestRole = User.roles.cache.reduce((prevRole, currRole) => {
                    return (prevRole.rawPosition > currRole.rawPosition) ? prevRole : currRole;
                });

                const otherUserhighestRole = otherUser.roles.cache.reduce((prevRole, currRole) => {
                    return (prevRole.rawPosition > currRole.rawPosition) ? prevRole : currRole;
                });


                if (UserhighestRole.rawPosition > otherUserhighestRole.rawPosition) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch (err) {
                console.log(err);
                this.BotConsole.log("Errore, non ho potuto controllare la posizione", "red");
                reject(-1);
            }
        });
    }

    checkPChannel(idChannel, arr) {
        return new Promise(async (resolve, reject) => {
            if (arr.length != 0) {
                this.checkValArr(arr, idChannel)
                    .then(() => {
                        resolve(0);
                    })
                    .catch(() => {
                        reject(-1);
                    });
            } else {
                resolve(0);
            }

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