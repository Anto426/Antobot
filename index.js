// New version of Anto bot v 5.0 
// const 
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { AttachmentBuilder } = require("discord.js");
const Discord = require('discord.js')
const fs = require("fs");
const { tokenload } = require('./functions/client/tokenload');
const { onlinef } = require('./functions/ready/ready');

//client 
global.client = new Discord.Client({
    intents: 3276799,
    partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
});

// token 
try {
    require("dotenv").config()
} catch { }

tokenload(process.env.TOKEN)
// file config
class config {
    constructor() {
        this.emded = require("./setting/embed.json");
        this.game = require("./setting/game.json");
        this.hollyday = require("./setting/hollyday.json");

    }
}

const configs = new config();


module.exports = {
    configs
}

client.on("ready", () => {
    onlinef()
})






