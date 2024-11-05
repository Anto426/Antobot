const { log } = require("../../../function/log/log");
const { errorIndex } = require("../../../function/err/errormenager");
module.exports = {
    name: "Log emojiDelete",
    typeEvent: "emojiDelete",
    allowevents: true,
    async execute(emoji) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.emojiDelete(emoji, tag);
            }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.LOG_INIT_ERROR));
        
        resolve(0);
        })
    }
}