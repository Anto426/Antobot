const fs = require("fs")
const Discord = require("discord.js")
async function comandload() {

    client.commands = new Discord.Collection();
    let commandsFolder
    try {
        commandsFolder = fs.readdirSync("./commands");
    } catch { }
    if (commandsFolder.length != 0)
        for (const folder of commandsFolder) {
            const commandsFiles = fs.readdirSync(`./commands/${folder}`);
            for (const file of commandsFiles) {
                if (file.endsWith(".js")) {
                    const command = require(`./commands/${folder}/${file}`);
                    client.commands.set(command.name, command);
                } else {
                    const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`)
                    for (const file2 of commandsFiles2) {
                        const command = require(`./commands/${folder}/${file}/${file2}`);
                        client.commands.set(command.name, command);


                    }
                }
            }
        }

}






module.exports = {
    comandload
}