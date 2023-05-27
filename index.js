// New version of Anto bot v 6.0
const { intclient } = require("./functions/client/intclient");
const { boot } = require("./functions/client/boot");
const { comandload } = require("./functions/client/loadc-e");

require("dotenv").config()
intclient()
comandload()
client.login(process.env.TOKEN)
global.optionsdate = { timeZone: 'Europe/Rome' };
setTimeout(() => { boot() }, 5000)
