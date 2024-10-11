const express = require('express');
const { BotConsole } = require("../function/log/botConsole");


class serverUpdate {

    constructor() {
        this.botconsole = new BotConsole();
        this.app = new express();
        this.app.use(express.json());
        this.port = 3000;
    }


    init() {

        return new Promise((resolve, reject) => {
            try {
                this.app.post('/webhook', (req, res) => {
                    console.log('Webhook received: '+ req.body);
                    res.status(200).send('Webhook processed');
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