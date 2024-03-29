const { eventbembed } = require("../../../embed/base/events");
const { Cjson } = require("../../../function/file/json");
const { consolelog } = require("../../../function/log/consolelog");
const setting = require("../../../setting/settings.json")




module.exports = {
    name: "AddM",
    typeEvent: "guildMemberAdd",
    async execute(member) {

        async function welcomemessage(json) {
            let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
            json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf0) => {
                let embedmsg = new eventbembed(member.guild)
                embedmsg.init().then(async () => {
                    let send = await embedmsg.welcome(member, humans.size).catch(() => { })
                    member.guild.channels.cache.find(x => x.id == jsonf0["Anto's  Server"].channel.info.welcome).send({ embeds: [send[0]], files: [send[1]] })

                }).catch(() => { })
                try {
                    member.roles.add(member.guild.roles.cache.find(x => x.id === jsonf0["Anto's  Server"].role.user))
                } catch { }

            })
        }





        if (!member.bot) {
            let json = new Cjson();
            await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then(async (jsonf) => {
                if (jsonf[member.guild.id][member.id]) {
                    jsonf[member.guild.id][member.id].roles.forEach(element => {
                        let role = member.guild.roles.cache.find(x => x.id === element);
                        if (role)
                            if (!member.roles.cache.has(role.id)) {
                                try {
                                    member.roles.add(role)
                                } catch { }
                            }

                    });

                    member.send("Bentornato")

                } else {

                    welcomemessage(json)

                }
            }).catch(async (err) => {
                welcomemessage(json)
            })
        } else {

            try {
                member.roles.add(member.guild.roles.cache.find(x => x.id === jsonf0["Anto's  Server"].role.bot))
            } catch { }

        }





    }

}