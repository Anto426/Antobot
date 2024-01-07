const { consolelog } = require("../log/consolelog")
const setting = require("./../../setting/settings.json")
class check {
    constructor() { }

    checkvalarr(arr, value) {
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(element => {
                    if (element == value) {
                        return resolve(true);
                    }
                });
            } catch {
                consolelog("Errore non ho potuto controllare nell 'array", "red")
                reject(-1)
            }

        })
    }

    checkvaljson(arr, value) {
        return new Promise(async (resolve, reject) => {

            try {
                for (let i in arr) {
                    if (arr[i] == value)
                        resolve(0)
                }
            } catch {
                consolelog("Errore non ho potuto controllare nell json", "red")
                reject(-1);
            }
        })
    }

    chekowner(arr, id) {
        return new Promise(async (resolve, reject) => {
            this.checkvalarr(arr, id)
                .catch(() => {
                    consolelog("Errore nel controlare ownwer", "red");
                    reject(-1);
                })
                .then(() => {
                    resolve(0);
                })
        })
    }

    chekisbot(iduser, idguild) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).bot) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                consolelog("Errore non ho potuto controllare se è un bot", "red")
                reject(-1)
            }
        })
    }

    checksowner(iduser, idguild) {
        return new Promise(async (resolve, reject) => {

            try {
                if (iduser == client.guilds.cache.find(x => x.id == idguild).ownerId) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch {
                consolelog("Errore non ho potuto controllare sowner", "red")
                reject(-1)
            }


        })

    }
    checkpermision(iduser, idguild, permision) {
        return new Promise(async (resolve, reject) => {

            try {
                if (permision.length != 0)
                    if (client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).permisions.has(permision)) {
                        resolve(0);
                    } else {
                        reject(-1);
                    }
                else
                    reject(-1)
            } catch (err) {

                consolelog("Errore non ho potuto controllare i permessi", "red")
                reject(-1)
            }


        })

    }

    checkisyou(iduser, otheruserid) {

        return new Promise(async (resolve, reject) => {
            if (iduser, otheruserid)
                if (iduser == otheruserid)
                    reject(-1)
                else
                    resolve(0)
            else {
                consolelog("Errore non ho potuto controllare se utente ha lo stesso id", "red")
                reject(-1)
            }


        })
    }

    checkposition(iduser, otheruserid, idguild) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == otheruserid) && !client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == otheruserid).bot && client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).roles.highest.position > client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == otheruserid).roles.highest.position) {
                    resolve(0);
                } else {
                    reject(-1);
                }
            } catch (err) {
                consolelog(err)
                consolelog("Errore non ho potuto controllare la posizione", "red")
                reject(-1)
            }


        })

    }


    checkpchannel(idchannel, arr) {

        return new Promise(async (resolve, reject) => {

            this.checkvalarr(arr, idchannel)
                .catch(() => {
                    consolelog("Errore non ho potuto controllare il canale", "red")
                    reject(-1);
                })
                .then(() => {
                    resolve(0);
                })


        })

    }

    checkallowopenai() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.opeanai.active)
                    resolve(0)
                else
                    reject(-1)
            } catch {
                consolelog("Errore non ho potuto controllare la variabile", "red")
                reject(-1)
            }

        })
    }

    checkallowdistube() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.music)
                    resolve(0)
                else
                    reject(-1)
            } catch {
                consolelog("Errore non ho potuto controllare la variabile", "red")
                reject(-1)
            }

        })
    }

    checkallowhollyday() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.hollyday)
                    resolve(0)
                else
                    reject(-1)
            } catch {
                consolelog("Errore non ho potuto controllare la variabile", "red")
                reject(-1)
            }

        })
    }

    checkallowstatus() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.status)
                    resolve(0)
                else
                    reject(-1)
            } catch {
                consolelog("Errore non ho potuto controllare la variabile", "red")
                reject(-1)
            }

        })
    }

    checkallowcaptcha() {
        return new Promise(async (resolve, reject) => {
            try {
                if (setting.var.captcha)
                    resolve(0)
                else
                    reject(-1)
            } catch {
                consolelog("Errore non ho potuto controllare la variabile", "red")
                reject(-1)
            }

        })
    }
}




module.exports = {
    check
}