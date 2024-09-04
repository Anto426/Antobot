const { EventEmbed } = require("../../../embed/base/events");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json")
module.exports = {
    name: "BoostEvent",
    typeEvent: "guildMemberUpdate",
    allowevents: true,
    async execute(oldMember, newMember) {
        if (oldMember.premiumSince === newMember.premiumSince) return
            let embedmsg = new EventEmbed(oldMember.guild, oldMember);
            let json = new Cjson();
            embedmsg.init().then(() => {
                json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((data) => {
                    if (data[newMember.guild.name]) {
                        let channel = newMember.guild.channels.cache.find(x => x.id === data[newMember.guild.name].channel.info.boost)
                        channel.send({ embeds: [embedmsg.boostEvent(newMember)] })
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }).catch((err) => {
                console.log(err);
            })
        

    }
}
