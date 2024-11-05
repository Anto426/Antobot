const { log } = require("../../../function/log/log");
const { errorIndex } = require("../../../function/err/errormenager");
module.exports = {
    name: "Log emojiUpdate",
    typeEvent: "emojiUpdate",
    allowevents: true,
    async execute(oldEmoji, newEmoji) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.emojiUpdate(oldEmoji, newEmoji, tag);
            }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.LOG_INIT_ERROR) );
        
        resolve(0);
        })
    }
}