const { log } = require("../../../function/log/log");
const { errorIndex } = require("../../../function/err/errormenager");

module.exports = {
    name: "Log guildBanAdd",
    typeEvent: "guildBanAdd",
    allowevents: true,
    async execute(guildban) {
        return new Promise((resolve, reject) => {
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.guildBanAdd(guildban, tag);
            }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.LOG_INIT_ERROR) );
        
        resolve(0);
        })
    }
}