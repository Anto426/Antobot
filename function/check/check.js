const { consolelog } = require("../log/consolelog")
const dirpatch = require("./../../setting/patch.json");
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
            checkvalarr(arr, id)
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
        return new Promise(async (resolve) => {

            try {
                if (iduser == Client.guilds.cache.find(x => x.id == idguild).OwnerId) {
                    resolve(true);
                } else {
                    resolve(false)
                }
            } catch {
                consolelog("Errore non ho potuto controllare sowner")
                reject(-1)
            }


        })

    }
    checkpermision(iduser, idguild, permision) {
        return new Promise(async (resolve) => {

            try {
                if (Client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).permisions.has(permision)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch {
                consolelog("Errore non ho potuto controllare i permessi")
                reject(-1)
            }


        })

    }

    checkposition(iduser, otheruserid, idguild) {
        return new Promise(async (resolve) => {
            try {
                if (Client.guilds.cache.find(x => x.id == idguild).members.cache.find(x => x.id == iduser).roles.highest.position > Client.guilds.cache.find(x => x.id == otheruserid).members.cache.find(x => x.id == iduser).roles.highest.position) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch {
                consolelog("Errore non ho potuto controllare la posizione")
                reject(-1)
            }


        })

    }


    checkpchannel(idchannel, arr) {
        return new Promise(async (resolve) => {
            try {
                arr.forEach(element => {
                    if (idchannel == dirpatch.database.guild.Allowchannels.find(x => x == element)) {
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