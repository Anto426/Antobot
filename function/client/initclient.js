const OpenAI = require('openai');
const { Client, Partials } = require('discord.js');


class clientinit {

    constructor() {

    }

    async intitialclientbase() {

        return new Promise((resolve, reject) => {

            try {
                global.client = new Client({
                    intents: 3276799,
                    partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
                })

                if (process.env.GITTOKEN)
                    client.gitToken = process.env.GITTOKEN;

                if (process.env.OPENAITOKEN)
                    client.openaitoken = process.env.OPENAITOKEN;

                resolve(0);


            } catch (err) {
                console.log("Errore nel inizializare il client di base");
                reject(err);
            }
        })
    }


    async intitialclientai() {
        return new Promise(async (resolve, reject) => {

            try {

                global.openai = new OpenAI({
                    apiKey: client.openaitoken
                });

                resolve(0)

            } catch (err) {
                console.log("Errore nel inizializare il client di base");
                reject(err);
            }
        })

    }


    async intitialclientai() {
        return new Promise(async (resolve, reject) => {

            try {
                global.openai = new OpenAI({
                    apiKey: client.openaitoken
                });
                resolve(0)
            } catch (err) {
                console.log("Errore nel inizializare il client di base");
                reject(err);
            }
        })

    }



}




module.exports = { clientinit }