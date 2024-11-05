const { log } = require("../../../function/log/log");
const { errorIndex } = require("../../../function/err/errormenager");

module.exports = {
    name: "Log channelCreate",
    typeEvent: "channelCreate",
    allowevents: true,
    async execute(channel) {
        return new Promise((resolve) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.addchannel(channel, tag);
            }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.LOG_INIT_ERROR));
            resolve(0);
        })

    }
}