const { InitguildInfo } = require("../../../function/interaction/button/initguild.js/initguildInfo");
const setting = require("../../../setting/settings.json");

module.exports = {
    name: "RemoveGuild",
    typeEvent: "guildDelete",
    allowevents: true,
    async execute(guild) {
        let initguild = new InitguildInfo(guild)
        initguild.reset(guild, process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch(() => { })
    }
};