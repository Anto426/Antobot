const { WriteCommand } = require("../../../function/commands/WriteCommand");


module.exports = {
    name: "NewGuild",
    typeEvent: "guildCreate",
    async execute(guild) {
        new WriteCommand().commandOneGuild(guild).catch(() => { });
    }
};