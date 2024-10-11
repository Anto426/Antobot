const express = require('express');
const { BotConsole } = require("../function/log/botConsole");
const { log } = require('../function/log/log');


class serverUpdate {

    constructor() {
        this.log = new log();
        this.botconsole = new BotConsole();
        this.app = new express();
        this.app.use(express.json());
        this.port = 3000;
    }


    init() {

        return new Promise((resolve, reject) => {
            try {
                this.app.post('/webhook', (req, res) => {
                    res.status(200).send('Webhook processed');
                    this.log.init().then(() => {
                        this.log.UpdateRecived(req.body.head_commit);
                    }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
                });
                resolve(0);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });

    }

    StartServer() {
        return new Promise((resolve, reject) => {
            try {
                this.app.listen(this.port, () => {
                    this.botconsole.log(`Server in ascolto sulla porta ${this.port}`, "green");
                });
                resolve(0);
            } catch (error) {
                reject(error);
            }
        });
    }


}

module.exports = {
    serverUpdate
}