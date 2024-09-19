const { InitguildInfo } = require("../../../function/interaction/button/initguild.js/initguildInfo");

module.exports = {
    name: "NewGuild",
    typeEvent: "guildRemove",
    allowevents: true,
    async execute(guild) {
        let initguild = new InitguildInfo(guild)
        initguild.reset(guild, process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch(() => { })
    }
};