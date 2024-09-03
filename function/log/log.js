const { BotConsole } = require("./botConsole");
const setting = require("./../../setting/settings.json");
const { logembed } = require("../../embed/log/logembed");
const { Cjson } = require("../file/json");
class log {

    constructor() {
        this.console = new BotConsole();
        this.json = new Cjson();
        this.guildJson = {};
    }

    init() {
        return new Promise(async (resolve, reject) => {
            await this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((json) => { this.guildJson = json }).catch(() => { new BotConsole().log(`Errore nell'inizializzare il json  + ${setting.configjson.online.name[2]}`, "red"); return reject(-1) })
            resolve(0);
        })
    }


    sendlog(embed, guild, tag) {
        return new Promise((resolve, reject) => {
            try {
                if (guild) {
                    if (this.guildJson[guild.name] && this.guildJson[guild.name].channel.bot["private-log"]) {
                        if (tag) guild.channels.cache.get(this.guildJson[guild.name].channel.bot["public-log"]).send({ embeds: [embed] });
                        guild.channels.cache.get(this.guildJson[guild.name].channel.bot["private-log"]).send({ embeds: [embed] });
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
                console.log(error);
                this.console.log("Errore nell'invio del log", "red");
                reject(-1);
            }
        })
    }

    addchannel(channel, tag) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.addchannel(channel), channel.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    deltechannel(channel, tag) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.deletechannel(channel), channel.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    updatechannel(newChannel, changedprop, tag) {
        let embedmsg = new logembed(newChannel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.updatechannel(newChannel, changedprop), newChannel.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiCreate(emoji, tag) {
        let embedmsg = new logembed(emoji.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiCreate(emoji), emoji.guild, tag).catch(() => { });
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiDelete(emoji, tag) {
        let embedmsg = new logembed(emoji.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiDelete(emoji), emoji.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiUpdate(oldEmoji, newEmoji, tag) {
        let embedmsg = new logembed(newEmoji.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiUpdate(oldEmoji, newEmoji), newEmoji.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    guildBanAdd(guildban, tag) {
        let embedmsg = new logembed(guildban.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildBanAdd(guildban.user, guildban.reason), user.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    guildBanRemove(guildban, tag) {
        let embedmsg = new logembed(guildban.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildBanRemove(guildban.user), guildban.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }



    guildMemberUpdate(member, changedprop, tag) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberUpdate(member, changedprop), member.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    guildUpdate(newGuild, oldGuild, tag) {
        let embedmsg = new logembed(newGuild.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildUpdate(newGuild, oldGuild), newGuild.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    inviteCreate(invite, tag) {
        let embedmsg = new logembed(invite.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.inviteCreate(invite), invite.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    inviteDelete(invite, tag) {
        let embedmsg = new logembed(invite.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.inviteDelete(invite), invite.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    ready(tag) {
        let embedmsg = new logembed(client.guilds.cache.get(this.guildJson["Anto's  Server"].id));
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.ready(), client.guilds.cache.get(this.guildJson["Anto's  Server"].id), tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    roleCreate(role, tag) {
        let embedmsg = new logembed(role.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.roleCreate(role), role.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }













}

module.exports = { log }