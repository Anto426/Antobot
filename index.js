// New version of Anto bot v 6.0

const { getBotInfo } = require("./functions/client/infoclient");
require('dotenv').config();
const { intclient } = require("./functions/client/intclient");
global.optionsdate = { timeZone: 'Europe/Rome' };
getBotInfo(process.env.TOKEN);


