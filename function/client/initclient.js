const { Client, Partials } = require('discord.js');


async function intitialclient() {

    return new Promise( (resolve, reject) => {

        try {
            global.client =  new Client({
                intents: 3276799,
                partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
            })

            resolve(true);


        } catch (err) {
            console.log("Errore nel inizializare il client");
            reject(err);
        }
    })
}


module.exports = { intitialclient }