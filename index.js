// New version of Anto bot v 6.0
const { intclient } = require("./functions/client/intclient");
const { boot } = require("./functions/client/boot");


require("dotenv").config()

intclient()
client.login(process.env.TOKEN)

global.options = { timeZone: 'Europe/Rome' };

setTimeout(() => { boot() }, 5000)

