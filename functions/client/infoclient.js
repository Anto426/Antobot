const axios = require('axios');
const prompt = require('prompt-sync')();
const fs = require("fs");
const { intclient } = require('./intclient');
const { boot } = require('./boot');

const patch = "./.env"
async function getBotInfo(token) {
    try {
        const response = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bot ${token}`
            }
        });

        const botID = response.data.id;
        const botName = response.data.username;

        console.log(`Bot ID: ${botID}`);
        console.log(`Bot Name: ${botName}`);
        let userresponse = prompt('Questo è il tuo client s/n/i:');
        switch (userresponse.toLowerCase()) {
            case "s":
                console.log("Client loading ....")
                intclient()
                client.login(token)
                setTimeout(() => { boot() }, 5000)
                break;
            case "n":
                console.log("Client reloading....")
                fs.unlinkSync(patch);
                getBotInfo(null)
                break;
            case "i":
                console.log("Interrupt....")
                break;
            default:
                console.log("Err: Input non valid!")
                getBotInfo(token)
                break;
        }
    } catch (err) {
        if (err.response) {
            console.log(`Error:Il token non è valido`)
            const temp = prompt('Inserisci qui il nuovo token:');
            console.log(`New token: ${temp}`);
            let content = `TOKEN=${temp}`
            fs.writeFile(patch, content.toString(), () => { })
            getBotInfo(temp)
        }
    }
}

module.exports = { getBotInfo }