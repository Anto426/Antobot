const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log voicestateupdate",
    typeEvent: "voiceStateUpdate",
    allowevents: true,
    async execute(oldState, newState) {

        const tag = false;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const user = newState.member.user;
        let logmodule = new log();

        logmodule.init().then(() => {
            if (!oldChannel && newChannel) {
                logmodule.voiceEnter(user, newChannel, tag);
            } else if (oldChannel && !newChannel) {
                logmodule.voiceExit(user, oldChannel, tag);
            } else if (oldChannel && newChannel && oldChannel !== newChannel.id) {
                logmodule.voiceChange(user, newChannel, tag);
            }
        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}