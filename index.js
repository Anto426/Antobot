// New version of Anto bot v 6.0
const { getBotInfo } = require("./functions/client/infoclient");

require("dotenv").config()
getBotInfo(process.env.TOKEN);


