const fs = require("fs");
const { consolelog } = require("../log/consolelog");
const axios = require("axios")
class json {
    constructor() {
    }


    jsonddypendencebufferolyf(url, token) {

        return new Promise((resolve, reject) => {
            axios.get(url, {
                headers: {
                    'Authorization': `token ${token}`
                },
            })
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    consolelog('Errore durante il download del file JSON: ' + error, "red")
                    reject(-1)
                });

        })

    }

    readJson(dir) {
        return new Promise((resolve, reject) => {
            try {
                const jsonData = fs.readFileSync(dir, 'utf8');
                const jsonObject = JSON.parse(jsonData);
                resolve(jsonObject);
            } catch (error) {
                consolelog('Errore durante la lettura file JSON ', "red");
                reject(error);
            }
        })
    }

    createJSONFile(filePath, dataObject) {
        return new Promise((resolve, reject) => {
            filePath = filePath.filter(".json", "");
            const jsonData = JSON.stringify(dataObject, null, 2);

            let dirpatch = filePath.substring(0, filePath.lastIndexOf('/'));

            if (!fs.existsSync(dirpatch)) {
                fs.mkdirSync(dirpatch)
            }

            fs.writeFile(`${filePath}.json`, jsonData, 'utf8', (err) => {
                if (err) {
                    consolelog('Errore durante la scrittura del file JSON', "red");
                    reject(err);
                    return;
                }
                resolve(0);
            });
        });
    }

    jsonexist(json) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(json))
                resolve(0)
            else {
                reject(-1)
                consolelog("Errore: json non esiste", "red")
            }

        });
    }


}

module.exports = {
    Cjson: json
}