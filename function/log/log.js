const { BotConsole } = require("./botConsole");
const setting = require("./../../setting/settings.json");
const { logembed } = require("../../embed/log/logembed");

class log {
    constructor() {
        this.console = new BotConsole();
        this.json = new Cjson();
        this.check = new Check();
        this.guildJson = {};
    }

    init() {
        return new Promise(async (resolve, reject) => {
            await this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((json) => { this.guildJson = json }).catch(() => { new BotConsole().log("Errore nell'inizializzare il json " + setting.configjson.online.name[2], "red"); return reject(-1) })
            resolve(0);
        })
    }

    addchannel(channel) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            embedmsg.addchannel(channel);
            channel.guild.channels.cache.get(this.guildJson[channel.guild.name].channel.bot["private-log"]).send({ embeds: [embedmsg.addchannel(channel)] });
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    deltechannel(channel) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            embedmsg.deletechannel(channel);
            channel.guild.channels.cache.get(this.guildJson[channel.guild.name].channel.bot["private-log"]).send({ embeds: [embedmsg.deletechannel(channel)] });
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    updatechannel(newChannel, changedprop) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            embedmsg.updatechannel(channel);
            channel.guild.channels.cache.get(this.guildJson[channel.guild.name].channel.bot["private-log"]).send({ embeds: [embedmsg.updatechannel(oldChannel, changedprop)] });
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }











}

module.exports = { log }