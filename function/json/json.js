const fs = require("fs");
const { consolelog } = require("../log/consolelog");
const axios = require("axios")
class json {
    constructor() {
    }
    getArrFromJson(dir) {

        return new Promise((resolve, reject) => {
            try {
                const jsonData = fs.readFileSync(dir, 'utf8');
                const jsonArray = JSON.parse(jsonData);

                if (Array.isArray(jsonArray)) {
                    return resolve(jsonArray);
                } else {
                    consolelog('Il file JSON non contiene un array.');
                    reject(-1);
                }
            } catch (error) {
                consolelog('Errore durante la conversione del file JSON in un array');
                reject(-1);
            }
        })

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
                    consolelog('Errore durante il download del file JSON: ' + error)
                    reject(-1)
                });

        })

    }

    getJsonToObject(dir) {
        try {
            const jsonData = fs.readFileSync(dir, 'utf8');
            const jsonObject = JSON.parse(jsonData);

            if (typeof jsonObject === 'object' && !Array.isArray(jsonObject)) {
                return resolve(jsonArray);
            } else {
                consolelog('Il file JSON non contiene un oggetto JavaScript.');
            }
        } catch (error) {
            consolelog('Errore durante la conversione del file JSON in un oggetto');
            reject(-1);
        }
    }
}

module.exports = {
    Cjson: json
}