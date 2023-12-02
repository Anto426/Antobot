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
            checkvalarr(arr, id)
                .catch(() => {
                    consolelog("Errore nel controlare ownwer");
                    reject(false);
                })
                .then(() => {
                    resolve(true);
                })
        })
    }

    checksowner(iduser, idguild) {
        return new Promise(async (resolve) => {
            if (iduser == Client.guilds.cache.find(x => x.id == idguild).OwnerId) {
                resolve(true);
            }

        })

    }

}

module.exports = {
    check
}