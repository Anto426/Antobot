const { EventEmbed } = require("../../../embed/base/events");
const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");
const setting = require("../../../setting/settings.json");



module.exports = {
    name: "AddM",
    typeEvent: "guildMemberAdd",
    allowevents: true,
    async execute(member) {
        let embedMsg = new EventEmbed(member.guild);
        embedMsg.init().then(async () => {
            let json = new Cjson();
            if (!member.user.bot) {
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

                        try {
                            let send = embedMsg.welcomeback(member, listrole);
                            member.send({ embeds: [send] }).catch(() => { new BotConsole().log("Non sono riuscito ad inviare il messaggio", "red") })
                        } catch { }



                    } else {

                        let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
                        json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).then((data) => {
                            let embedmsg = new EventEmbed(member.guild)
                            embedmsg.init().then(async () => {
                                let send = await embedmsg.welcome(member, humans.size).catch(() => { })
                                member.guild.channels.cache.get(data[member.guild.id].channel.welcome).send({ embeds: [send[0]], files: [send[1]] });
                                member.roles.add(member.guild.roles.cache.find(x => x.id === data[member.guild.id].role.roledefault)).catch(() => { new BotConsole().log("Non sono riuscito ad aggiungere il ruolo", "red") })
                            }).catch(() => { })


                        })

                    }
                }).catch(async (err) => {
                    new BotConsole().log(err, "red");
                })


            } else {
                try {
                    json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).then((data) => {
                        member.roles.add(member.guild.roles.cache.find(x => x.id === data[member.guild.id].role.botroledefault));
                    })
                } catch (err) {
                    new BotConsole().log(err, "red");
                }
            }

        }).catch(() => { new BotConsole().log("Non sono riuscito a iniziallizzare embed di base", "red") })



    }





}

