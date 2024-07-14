
const fs = require("fs");
const { BotConsole } = require("../log/botConsole");;
const axios = require("axios")
class json {
    constructor() { }


    jsonDependencyBuffer(url, token) {

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
                    new BotConsole().log('Errore durante il download del file JSON: ' + error, "red");
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
                new BotConsole().log('Errore durante la lettura del file JSON', "red");
                reject(error);
            }
        })
    }

    createJSONFile(filePath, dataObject) {
        return new Promise((resolve, reject) => {
            filePath = filePath.toString().replace(".json", "");
            const jsonData = JSON.stringify(dataObject, null, 2);

            let dirPath = filePath.substring(0, filePath.lastIndexOf('/'));

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath)
            }

            fs.writeFile(`${filePath}.json`, jsonData, 'utf8', (err) => {
                if (err) {
                    new BotConsole().log('Errore durante la scrittura del file JSON', "red");
                    reject(err);
                    return;
                }
                new BotConsole().log(`${filePath}.json creato con successo`, "green")
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
                new BotConsole().log("Errore: il file JSON non esiste", "red");
            }

        });
    }


}

module.exports = {
    Cjson: json
}