const { Cjson } = require("../../../function/json/json");
const { consolelog } = require("../../../function/log/consolelog");
const setting = require("./../../../setting/settings.json")
module.exports = {
    name: "addM",
    typeEvent: "guildMemberAdd",
    async execute(member) {
        if (!member.bot) {
            let json = new Cjson();
            await json.readJson(setting.database.root + "/" + setting.database.listoldmebers).then((json) => {
                if (json[member.guild.id][member.id]) {
                    json[member.guild.id][member.id].roles.forEach(element => {
                        let role = member.guild.roles.cache.find(x => x.id === element);
                        if (role)
                            if (!member.roles.cache.has(role.id)) {
                                member.roles.add(role)
                            }

                    });



                } else {

                }
            }).catch((err) => {
                consolelog(err)
            })
        }else{
            
        }





    }

}