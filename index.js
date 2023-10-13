// New version of Anto bot v 6.0
const { intclient } = require("./functions/client/intclient");
const { boot } = require("./functions/client/boot");
require("dotenv").config()
global.optionsdate = { timeZone: 'Europe/Rome' };


intclient()
client.login(process.env.TOKEN)
setTimeout(() => { boot() }, 6000)