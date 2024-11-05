const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
const { errorIndex } = require("../../../function/err/errormenager");

module.exports = {
    name: "Log guildBanRemove",
    typeEvent: "guildBanRemove",
    allowevents: true,
    async execute(guildban) {

        return new Promise((resolve, reject) => {
            let logmodule = new log();
            let console = new BotConsole();
            logmodule.init().then(() => {
                logmodule.guildBanRemove(guildban);
            }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.LOG_INIT_ERROR));

            resolve(0);
        })


    }
}