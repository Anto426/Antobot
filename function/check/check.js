const { consolelog } = require("../log/consolelog")
class check {
    constructor() { }

    checkvalarr(arr, value) {
        return new Promise((resolve, reject) => {
            try {
                for (let i in arr) {
                    if (i == value)
                        return resolve(true)
                }
            } catch {
                consolelog("Errore non ho potuto controllare nell 'array")
                reject(-1)
            }

        })
    }

    checkvaljson(arr, value) {
        return new Promise(async (resolve, reject) => {

            try {
                for (let i in arr) {
                    if (arr[i] == value)
                        resolve(true)
                }
            } catch {
                console.log("Errore non ho potuto controllare nell json")
                reject(-1);
            }
        })
    }

    chekowner(arr, id) {
        return new Promise(async (resolve, reject) => {
            this.checkvalarr(arr, id)
                .catch(() => {
                    consolelog("Errore nel controlare ownwer");
                    reject(-1);
                })
                .then(() => {
                    resolve(true);
                })
        })
    }

    checksowner(iduser, idguild) {
        return new Promise(async (resolve, reject) => {

            try {
                if (iduser == client.guilds.cache.find(x => x.id == idguild).OwnerId) {
                    resolve(true);
                } else {
                    reject(-1);
                }
            } catch {
                consolelog("Errore non ho potuto controllare sowner")
                reject(-1)
            }


        })

    }
    checkpermision(iduser, idguild, permision) {
        return new Promise(async (resolve, reject) => {

            try {
                if (client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).permisions.has(permision)) {
                    resolve(true);
                } else {
                    reject(-1);
                }
            } catch {
                consolelog("Errore non ho potuto controllare i permessi")
                reject(-1)
            }


        })

    }

    checkposition(iduser, otheruserid, idguild) {
        return new Promise(async (resolve, reject) => {
            try {
                if (client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == otheruserid) && !client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == otheruserid).bot && client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).roles.highest.position > client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == otheruserid).roles.highest.position) {
                    resolve(true);
                } else {
                    reject(-1);
                }
            } catch (err) {
                consolelog(err)
                consolelog("Errore non ho potuto controllare la posizione")
                reject(-1)
            }


        })

    }


    checkpchannel(idchannel, arr) {
        return new Promise(async (resolve, reject) => {
            try {
                arr.forEach(element => {
                    if (idchannel == arr.find(x => x == element)) {
                        return resolve(true);
                    }
                });
                resolve(false)
            } catch {
                consolelog("Errore non ho potuto controllare il canale")
                reject(-1)
            }

        })

    }

}




module.exports = {
    check
}