const Discord = require('discord.js')
const { Client, GatewayIntentBits, Partials } = require('discord.js');


async function intclient() {
    global.client = new Discord.Client({
        intents: 3276799,
        partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
    });
}

module.exports = {
    intclient
}