const { Cjson } = require("../../../function/json/json");
const { consolelog } = require("../../../function/log/consolelog");
const setting = require("../../../setting/settings.json")
module.exports = {
    name: "LeftM",
    typeEvent: "guildMemberRemove",
    async execute(member) {

        let json = new Cjson();
        await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then((jsonf) => {
            jsonf[member.guild.id][member.id].roles = Array.from(member.roles.cache).map(role => role[1].id);
            json.createJSONFile(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers, jsonf).catch((err) => { consolelog(err) })

        }).catch(() => {
            const jsons = {
                [member.guild.id]: {
                    [member.id]: {
                        roles: Array.from(member.roles.cache)[0]
                    }
                }
            }
            json.createJSONFile(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers, jsons).catch((err) => { consolelog(err) })
        })



    }

}