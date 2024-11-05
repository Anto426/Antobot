const { Cjson } = require("../../../function/file/json");
const { log } = require("../../../function/log/log");
const setting = require("../../../setting/settings.json");
module.exports = {
    name: "Log guildMemberAdd",
    typeEvent: "guildMemberAdd",
    allowevents: true,
    async execute(member) {

        return new Promise((resolve, reject) => {
            let logmodule = new log();
            let json = new Cjson();
            logmodule.init().then(() => {

                if (!member.user.bot) {

                    json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then(async (jsondatabase) => {

                        if (!jsondatabase[member.guild.id]) {

                            logmodule.guildMemberAdd(member);
                        } else {
                            if (!jsondatabase[member.guild.id][member.id]) {
                                logmodule.guildMemberAdd(member);
                            } else {
                                let roles = jsondatabase[member.guild.id][member.id].roles
                                let rolesname = [];
                                roles.forEach((role) => {
                                    member.guild.roles.cache.find(r => r.id === role) ? rolesname.push(member.guild.roles.cache.find(r => r.id === role).name) : null;
                                });
                                logmodule.guildMemberAddReturn(member, rolesname);

                            }
                        }


                    }).catch((err) => { console.log(err) });

                } else {
                    logmodule.guildMemberAddBot(member);
                }


            }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
        });

    }
}