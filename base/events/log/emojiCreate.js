const { log } = require("../../../function/log/log");
const { errorIndex } = require("../../../function/err/errormenager");

module.exports = {
    name: "Log emojiCreate",
    typeEvent: "emojiCreate",
    allowevents: true,
    async execute(emoji) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.emojiCreate(emoji, tag);
            }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.LOG_INIT_ERROR));
        resolve(0);
        })
    }
}