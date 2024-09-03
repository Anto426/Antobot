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


    sendlog(embed, guild, tag) {
        return new Promise((resolve, reject) => {
            try {
                if (guild) {
                    if (this.guildJson[channel.guild.name] && this.guildJson[channel.guild.name].channel.bot["private-log"]) {
                        if (tag) guild.channels.cache.get(this.guildJson[channel.guild.name].channel.bot["public-log"]).send({ embeds: [embed] });
                        guild.channels.cache.get(this.guildJson[channel.guild.name].channel.bot["private-log"]).send({ embeds: [embed] });
                        resolve(0);
                    }
                    else {
                        this.console.log("Errore nel trovare il canale di log", "red");
                        reject(-1);
                    }
                } else {
                    this.console.log("Errore nel trovare il server", "red");
                    reject(-1);
                }
            } catch (error) {
                this.console.log("Errore nell'invio del log", "red");
                reject(-1);
            }
        })
    }

    addchannel(channel, tag) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.addchannel(channel), channel.guild, tag);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    deltechannel(channel, tag) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.deletechannel(channel), channel.guild, tag);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    updatechannel(newChannel, changedprop, tag) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.updatechannel(newChannel, changedprop), channel.guild, tag);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiCreate(emoji, tag) {
        let embedmsg = new logembed(channel.guild, channel);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiCreate(emoji), channel.guild, tag);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }
















}

module.exports = { log }