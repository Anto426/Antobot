const { errorIndex } = require("../../../function/err/errormenager");
const { InitguildInfo } = require("../../../function/interaction/button/initguild.js/initguildInfo");
const setting = require("../../../setting/settings.json");

module.exports = {
    name: "RemoveGuild",
    typeEvent: "guildDelete",
    allowevents: true,
    async execute(guild) {
        return new Promise(async (resolve, reject) => {
            let initguild = new InitguildInfo(guild)
            await initguild.reset(guild, process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch(() => {
                reject(errorIndex.GENERIC_ERROR)
            })
            resolve(0);
        })

    }
};