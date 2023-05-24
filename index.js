// New version of Anto bot v 5.0 
// const
const { intclient } = require('./functions/client/intclient');
const { eventload } = require("./functions/client/loadc-e");
const { tokenload } = require('./functions/client/tokenload');
global.bootstate = false
global.check = false
global.AllowCommands = []
//client 
intclient()
// token 
try {
    require("dotenv").config()
} catch { }

tokenload(process.env.TOKEN)

eventload()

