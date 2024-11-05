const { EventEmbed } = require("../../../embed/base/events");
const { errorIndex } = require("../../../function/err/errormenager");
const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");
const setting = require("../../../setting/settings.json");



module.exports = {
    name: "AddM",
    typeEvent: "guildMemberAdd",
    allowevents: true,
    async execute(member) {

        return new Promise((resolve, reject) => {
            let embedMsg = new EventEmbed(member.guild, null, member.user.displayAvatarURL());
            let botconsole = new BotConsole();
            embedMsg.init().then(async () => {


                let json = new Cjson();
                if (!member.user.bot) {
                    await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then(async (jsonf) => {
                        if (json[member.guild.id] && jsonf[member.guild.id][member.id]) {
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
                                member.send({ embeds: [send] }).catch(() => { reject(errorIndex.SYSTEM_ERRORS.SEND_MESSAGE_ERROR) })
                            } catch { reject(errorIndex.SYSTEM_ERRORS.GENERIC_ERROR) }

                        } else {

                            let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
                            json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).then((data) => {
                                let embedmsg = new EventEmbed(member.guild)
                                embedmsg.init().then(async () => {
                                    let send = await embedmsg.welcome(member, humans.size).catch(() => { reject(errorIndex.SYSTEM_ERRORS.SEND_MESSAGE_ERROR) });
                                    member.guild.channels.cache.get(data[member.guild.id].channel.welcome).send({ embeds: [send[0]], files: [send[1]] });
                                    member.roles.add(member.guild.roles.cache.find(x => x.id === data[member.guild.id].role.roledefault)).catch(() => { reject(errorIndex.SYSTEM_ERRORS.ADD_ROLE_ERROR) });
                                }).catch(() => { })


                            })

                        }
                    }).catch(async (err) => {
                        botconsole.log(err, "red");
                    })
                } else {
                    try {
                        json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).then((data) => {
                            member.roles.add(member.guild.roles.cache.find(x => x.id === data[member.guild.id].role.botroledefault));
                        })
                    } catch (err) {
                        botconsole.log(err, "red");
                    }
                    resolve(0)
                }

            }).catch(() => { reject(errorIndex.SYSTEM_ERRORS.INIT_ERROR) })

        })


    }





}

