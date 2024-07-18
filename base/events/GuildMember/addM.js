const { EventEmbed } = require("../../../embed/base/events");
const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");
const setting = require("../../../setting/settings.json");



module.exports = {
    name: "AddM",
    typeEvent: "guildMemberAdd",
    async execute(member) {
        let embedMsg = new EventEmbed(member.guild);
        embedMsg.init().then(async () => {
            let json = new Cjson();
            if (!member.user.bot) {
                await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmembers).then(async (jsonf) => {
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

                        try {
                            let send = embedMsg.welcomeBack(member, listrole);
                            member.send({ embeds: [send] }).catch(() => { new BotConsole().log("Non sono riuscito ad inviare il messaggio", "red") })
                        } catch { }



                    } else {

                        let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
                        json.jsonDependencyBufferOnly(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf0) => {
                            let embedmsg = new eventbembed(member.guild)
                            embedmsg.init().then(async () => {
                                let send = await embedmsg.welcome(member, humans.size).catch(() => { })
                                member.guild.channels.cache.find(x => x.id === jsonf0[mamber.guild.name].channel.info.welcome).send({ embeds: [send[0]], files: [send[1]] });

                            }).catch(() => { })
                            try {
                                member.roles.add(member.guild.roles.cache.find(x => x.id === jsonf0[mamber.guild.name].role.user));
                            } catch { }

                        })

                    }
                }).catch(async (err) => {
                    new BotConsole().log(err, "red");
                })


            } else {

                try {
                    json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf0) => {
                        member.roles.add(member.guild.roles.cache.find(x => x.id === jsonf0[mamber.guild.name].role.bot));
                    })
                } catch (err) {
                    new BotConsole().log(err, "red");
                }
            }

        }).catch(() => { new BotConsole().log("Non sono riuscito a iniziallizzare embed di base", "red") })



    }





}

