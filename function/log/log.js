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
            this.guildJson = await this.json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch(() => { new BotConsole().log(`Errore nell'inizializzare il guild json`, "red"); return reject(-1) })
            resolve(0);
        })
    }


    sendlog(embed, guild) {
        return new Promise((resolve, reject) => {
            try {
                if (guild) {
                    if (this.guildJson[guild.id] && this.guildJson[guild.id].channel.log) {
                        guild.channels.cache.find(x => x.id === this.guildJson[guild.id].channel.log).send({ embeds: [embed] }).then(() => { resolve(0) }).catch(() => { reject(-1) });
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

    addchannel(channel) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.addchannel(channel), channel.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    deltechannel(channel) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.deletechannel(channel), channel.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    updatechannel(newChannel, changedprop) {
        let embedmsg = new logembed(newChannel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.updatechannel(newChannel, changedprop), newChannel.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiCreate(emoji) {
        let embedmsg = new logembed(emoji.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiCreate(emoji), emoji.guild).catch(() => { });
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiDelete(emoji) {
        let embedmsg = new logembed(emoji.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiDelete(emoji), emoji.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    emojiUpdate(oldEmoji, newEmoji) {
        let embedmsg = new logembed(newEmoji.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.emojiUpdate(oldEmoji, newEmoji), newEmoji.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    guildBanAdd(guildban) {
        let embedmsg = new logembed(guildban.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildBanAdd(guildban), guildban.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    guildBanRemove(guildban) {
        let embedmsg = new logembed(guildban.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildBanRemove(guildban.user), guildban.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }



    guildMemberUpdate(member, changedprop) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberUpdate(member, changedprop), member.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    guildUpdate(newGuild, oldGuild) {
        let embedmsg = new logembed(newGuild.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildUpdate(newGuild, oldGuild), newGuild.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    inviteCreate(invite) {
        let embedmsg = new logembed(invite.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.inviteCreate(invite), invite.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }

    inviteDelete(invite) {
        let embedmsg = new logembed(invite.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.inviteDelete(invite), invite.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    ready() {

        client.guilds.cache.forEach(guild => {

            if (this.guildJson[guild.id]) {
                let embedmsg = new logembed(guild);
                embedmsg.init().then(() => {
                    this.sendlog(embedmsg.ready(), guild).catch(() => { });
                }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
            } else {
                this.console.log("Non ho il canale per inviare il messagio", "red");
            }


        });

    }

    roleCreate(role) {
        let embedmsg = new logembed(role.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.roleCreate(role), role.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }



    roleDelete(role) {
        let embedmsg = new logembed(role.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.roleDelete(role), role.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }


    roleUpdate(oldRole, changedprop) {
        let embedmsg = new logembed(oldRole.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.roleUpdate(oldRole, changedprop), oldRole.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    guildMemberAdd(member, tag) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberAdd(member), member.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    guildMemberAddReturn(member, rolenamelist, tag) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberAddReturn(member, rolenamelist), member.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
    }



    guildMemberRemove(member) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberRemove(member), member.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    voiceEnter(user, channel) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.voiceEnter(user, channel), channel.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    voiceExit(user, channel) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.voiceExit(user, channel), channel.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    voiceChange(user, channel) {
        let embedmsg = new logembed(channel.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.voiceChange(user, channel), channel.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }


    guildMemberAddBot(member) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberAddBot(member), member.guild).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    guildMemberRemoveBot(member, tag) {
        let embedmsg = new logembed(member.guild);
        embedmsg.init().then(() => {
            this.sendlog(embedmsg.guildMemberRemoveBot(member), member.guild, tag).catch(() => { });
        }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });

    }

    UpdateRecived(commits, authors, emojiMap) {
        console.log(this.guildJson)

        client.guilds.cache.forEach(guild => {
            if (this.guildJson[guild.id]) {
                let embedmsg = new logembed(guild);
                embedmsg.init().then(() => {
                    this.sendlog(embedmsg.UpdateRecived(commits, authors, emojiMap), guild).catch(() => { });
                }).catch((err) => { console.log(err); this.console.log("Errore nell'inizializzare l'embed", "red") });
            } else {
                this.console.log("Non ho il canale per inviare il messagio", "red");
            }

        });
    }

}

module.exports = { log }