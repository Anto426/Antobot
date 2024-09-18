const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");
const setting = require("../../../setting/settings.json")

module.exports = {
    name: "LeftM",
    typeEvent: "guildMemberRemove",
    allowevents: true,
    async execute(member) {

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
            json.createJSONFile(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers, data).catch(() => { });

        }).catch((err) => {
            new BotConsole().log(err);
            const jsons = {
                [member.guild.id]: {
                    [member.id]: {
                        roles: Array.from(member.roles.cache).map(role => role[1].id)
                    }
                }
            };

            json.createJSONFile(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers, jsons).catch((err) => { new BotConsole().log(err, "red"); });
        });

    }
}