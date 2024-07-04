const { eventbembed } = require("../../../embed/base/events");
const { Cjson } = require("../../../function/file/json");
const { consolelog } = require("../../../function/log/consolelog");
const setting = require("../../../setting/settings.json")




module.exports = {
    name: "AddM",
    typeEvent: "guildMemberAdd",
    async execute(member) {

        if (!member.bot) {
            let embedmsg = new eventbembed(member.guild)
            embedmsg.init().catch(() => { consolelog("Non sono riuscito a iniziallizzare embed di base", "red") })
            let json = new Cjson();
            await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then(async (jsonf) => {
                if (jsonf[member.guild.id][member.id]) {
                    let listrole = [];
                    jsonf[member.guild.id][member.id].roles.forEach(element => {
                        let role = member.guild.roles.cache.find(x => x.id === element);
                        if (role)
                            if (!member.roles.cache.has(role.id)) {
                                try {
                                    listrole.push(role.name);
                                    member.roles.add(role);
                                } catch { }
                            }

                    });

                    let send = await embedmsg.welcomeback(member, listrole).catch((err) => { consolelog(err); consolelog("Non sono riuscito ad inviare il messaggio", "red") })
                    member.send({ embeds: [send] })


                } else {

                    let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
                    json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf0) => {
                        embedmsg.init().then(async () => {
                            let send = await embedmsg.welcome(member, humans.size).catch(() => { })
                            member.guild.channels.cache.find(x => x.id == jsonf0["Anto's  Server"].channel.info.welcome).send({ embeds: [send[0]], files: [send[1]] })

                        }).catch(() => { })
                        try {
                            member.roles.add(member.guild.roles.cache.find(x => x.id === jsonf0["Anto's  Server"].role.user))
                        } catch { }

                    })

                }
            }).catch(async (err) => {

            })
        } else {

            try {
                member.roles.add(member.guild.roles.cache.find(x => x.id === jsonf0["Anto's  Server"].role.bot))
            } catch { }

        }





    }

}