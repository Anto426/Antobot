const { Client, Partials } = require('discord.js');


async function intclient() {
    global.client = new Client({
        intents: 3276799,
        partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
    });
}

module.exports = {
    intclient
}