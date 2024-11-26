const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log voicestateupdate",
    typeEvent: "voiceStateUpdate",
    allowevents: true,
    async execute(oldState, newState) {

        return new Promise((resolve, reject) => {
            const tag = false;

        })


    }
}