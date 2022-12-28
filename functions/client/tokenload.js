const fs = require("fs")
const prompt = require('prompt-sync')();
const Discord = require("discord.js")
async function tokenload(token) {

    client.login(token).catch((err) => {
        console.log(`Error:Token not valid! `)
        const temp = prompt('Inser here new token:');
        console.log(`New token: ${temp}`);
        let content = `TOKEN=${temp}`
        let patch = "./.env"
        fs.writeFile(patch,content.toString(),()=>{} )
        tokenload(temp)
    })

}






module.exports = {
    tokenload
}