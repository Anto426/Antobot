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

            const jsonData = JSON.stringify(dataObject, null, 2);

            fs.writeFile(filePath, jsonData, 'utf8', (err) => {
                if (err) {
                    consolelog('Errore durante la scrittura del file', "red");
                    reject(err);
                    return;
                }
                resolve(0);
            });
        });
    }


}

module.exports = {
    Cjson: json
}