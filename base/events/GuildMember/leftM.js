const { errorIndex } = require("../../../function/err/errormenager");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json")

module.exports = {
    name: "LeftM",
    typeEvent: "guildMemberRemove",
    allowevents: true,
    async execute(member) {

        return new Promise((resolve, reject) => {
            if (member.user.bot) return;
            let json = new Cjson();
            json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then((data) => {

                if (!data[member.guild.id]) {
                    data[member.guild.id] = {};
                }

                if (!data[member.guild.id][member.id]) {
                    data[member.guild.id][member.id] = {};
                }

                data[member.guild.id][member.id].roles = Array.from(member.roles.cache).map(role => role[1].id);
                json.createJSONFile(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers, data).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.CREATE_JSON_ERROR));

            }).catch(() => {
                const jsons = {
                    [member.guild.id]: {
                        [member.id]: {
                            roles: Array.from(member.roles.cache).map(role => role[1].id)
                        }
                    }
                };

                json.createJSONFile(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers, jsons).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.CREATE_JSON_ERROR));
            });
        
        resolve(0);

        })
    }
}