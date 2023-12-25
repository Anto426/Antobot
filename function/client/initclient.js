const OpenAI = require('openai');
const { Client, Partials } = require('discord.js');
const { consolelog } = require('../log/consolelog');


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

                let openai = new OpenAI({
                    apiKey: client.openaitoken
                });


                const chatCompletion = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: 'Say this is a test' }],
                    model: 'gpt-3.5-turbo',
                });
                consolelog(response.choise[0].messages.content)
                resolve(0)

            } catch (err) {
                console.log("Errore nel inizializare il client di base");
                reject(err);
            }
        })

    }



}




module.exports = { clientinit }