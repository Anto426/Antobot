const { Cjson } = require("../../../function/file/json");
const { log } = require("../../../function/log/log");
const setting = require("../../../setting/settings.json");
module.exports = {
    name: "Log guildMemberAdd",
    typeEvent: "guildMemberAdd",
    async execute(member) {
        const tag = true;
        let logmodule = new log();
        let json = new Cjson();
        logmodule.init().then(() => {
            json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then(async (jsondatabase) => {

                if (!jsondatabase[member.guild.id]) {
                    logmodule.guildMemberAdd(member, tag);
                } else
                    if (!jsondatabase[member.guild.id][member.id]) {
                        logmodule.guildMemberAdd(member, tag);
                    } else {
                        let roles = jsondatabase[member.guild.id][member.id].roles
                        let rolesname = [];
                        roles.forEach((role) => {
                            member.guild.roles.cache.find(r => r.id === role) ? rolesname.push(member.guild.roles.cache.find(r => r.id === role).name) : null;
                        });
                        
                        logmodule.guildMemberAddReturn(member, rolesname, tag);

                    }

            }).catch((err) => { console.log(err) });

        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}