const setting = require("./../../setting/settings.json");
const { BotConsole } = require("./botConsole");
const { logembed } = require("../../embed/log/logembed");
const { Cjson } = require("../file/json");

class Log {
    constructor() {
        this.console = new BotConsole();
        this.json = new Cjson();
        this.guildJson = {};
    }

    async init() {
        try {
            this.guildJson = await this.json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig);
            return 0;
        } catch {
            this.console.log(`Errore nell'inizializzare il guild json`, "red");
            return -1;
        }
    }

    async sendLog(embed, guild) {
        if (!guild) {
            this.console.log("Errore nel trovare il server", "red");
            return -1;
        }

        const logChannelId = this.guildJson[guild.id]?.channel?.log;
        if (!logChannelId) {
            this.console.log("Errore nel trovare il canale di log", "red");
            return -1;
        }

        try {
            const logChannel = guild.channels.cache.find(x => x.id === logChannelId);
            await logChannel.send({ embeds: [embed] });
            return 0;
        } catch (error) {
            this.console.log("Errore nell'invio del log", "red");
            console.error(error);
            return -1;
        }
    }

    async handleEmbedAction(action, ...args) {
        const guild = args[0]?.guild;
        if (!guild) return;

        const embedmsg = new logembed(guild);
        try {
            await embedmsg.init();
            const embed = embedmsg[action](...args);
            await this.sendLog(embed, guild);
        } catch (err) {
            this.console.log("Errore nell'inizializzare l'embed", "red");
            console.error(err);
        }
    }
    channelCreate(channel) {
        this.handleEmbedAction('addchannel', channel);
    }

    channelDelete(channel) {
        this.handleEmbedAction('deletechannel', channel);
    }

    channelUpdate(newChannel, changedprop) {

        let json = new Cjson();
        json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).then((data) => {

            let changedprop = [];
            let keys = [
                { key: "name", label: "📛 name" },
                { key: "position", label: "📍 position" },
                { key: "topic", label: "📝 topic" },
                { key: "nsfw", label: "🔞 nsfw" },
                { key: "rateLimitPerUser", label: "⏱️ slowmode" },
                { key: "parentID", label: "🔗 parentID" },
                { key: "bit", label: "🔒 permissionOverwrites" },
                { key: "bitrate", label: "🔊 bitrate" },
                { key: "userLimit", label: "👥 userLimit" },
            ];

            keys.forEach(({ key, label }) => {
                if (oldChannel[key] !== newChannel[key]) {
                    changedprop.push({ key: label, old: oldChannel[key], new: newChannel[key] });
                }
            });

            if (changedprop.length > 0 && newChannel.parentId !== data[newChannel.guild.id].channel.hollyday.id)
                this.updatechannel(newChannel, changedprop, tag);

        }).catch(reject(interaction, errorIndex.SYSTEM_ERRORS.READ_JSON_ERROR));

        this.handleEmbedAction('updatechannel', newChannel, changedprop);
    }

    emojiCreate(emoji) {
        this.handleEmbedAction('emojiCreate', emoji);
    }

    emojiDelete(emoji) {
        this.handleEmbedAction('emojiDelete', emoji);
    }

    emojiUpdate(oldEmoji, newEmoji) {
        this.handleEmbedAction('emojiUpdate', oldEmoji, newEmoji);
    }

    guildBanAdd(guildban) {
        this.handleEmbedAction('guildBanAdd', guildban);
    }

    guildBanRemove(guildban) {
        this.handleEmbedAction('guildBanRemove', guildban.user);
    }

    guildMemberAdd(member, tag) {
        let json = new Cjson();

            if (!member.user.bot) {

                json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.listoldmebers).then(async (jsondatabase) => {

                    if (!jsondatabase[member.guild.id]) {

                    } else {
                        if (!jsondatabase[member.guild.id][member.id]) {
                            logmodule.guildMemberAdd(member);
                        } else {
                            let roles = jsondatabase[member.guild.id][member.id].roles
                            let rolesname = [];
                            roles.forEach((role) => {
                                member.guild.roles.cache.find(r => r.id === role) ? rolesname.push(member.guild.roles.cache.find(r => r.id === role).name) : null;
                            });

                        }
                    }

                    


                }).catch((err) => { console.log(err) });

            } else {
                logmodule.guildMemberAddBot(member);
            }


    }

    guildMemberRemove(member) {

        if (!member.user.bot) {
            logmodule.guildMemberRemove(member);
        } else {
            tag = false;
            logmodule.guildMemberRemoveBot(member);
        }
    }

    guildMemberUpdate(member, oldMember) {
        const tag = false;

        logmodule.init().then(() => {
            let changedprop = [];
            const keys = [
                { key: "name", label: "📛 Name" },
                { key: "region", label: "🌍 Region" },
                { key: "verificationLevel", label: "✅ Verification Level" },
                { key: "afkChannelID", label: "💤 AFK Channel" },
                { key: "afkTimeout", label: "⏲️ AFK Timeout" },
                { key: "icon", label: "🖼️ Icon" },
                { key: "splash", label: "🌊 Splash" },
                { key: "banner", label: "🎨 Banner" },
                { key: "systemChannelID", label: "📢 System Channel" },
                { key: "preferredLocale", label: "🌐 Preferred Locale" }
            ];

            keys.forEach(({ key, label }) => {
                if (oldGuild[key] !== newGuild[key]) {
                    changedprop.push({ key: label, old: oldGuild[key], new: newGuild[key] });
                }
            });

            if (changedprop.length > 0)
                logmodule.guildUpdate(newGuild, changedprop, tag);

        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }

    guildUpdate(newGuild, oldGuild) {
        this.handleEmbedAction('guildUpdate', newGuild, oldGuild);
    }

    inviteCreate(invite) {
        this.handleEmbedAction('inviteCreate', invite);
    }

    inviteDelete(invite) {
        this.handleEmbedAction('inviteDelete', invite);
    }

    roleCreate(role) {
        this.handleEmbedAction('roleCreate', role);
    }

    roleDelete(role) {
        this.handleEmbedAction('roleDelete', role);
    }

    roleUpdate(oldRole, changedprop) {
        let changedprop = [];
        const keys = [
            { key: "name", label: "📛 Name" },
            { key: "color", label: "🎨 Color" },
            { key: "hoist", label: "📌 Hoisted" },
            { key: "position", label: "📍 Position" },
            { key: "mentionable", label: "📣 Mentionable" }
        ];

        keys.forEach(({ key, label }) => {
            if (oldRole[key] !== newRole[key]) {
                changedprop.push({ key: label, old: oldRole[key], new: newRole[key] });
            }
        });

        if (changedprop.length > 0)
            logmodule.roleUpdate(newRole, changedprop, tag);
    }

    voiceStateUpdate(user, channel) {
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const user = newState.member.user;
        let logmodule = new log();

        logmodule.init().then(() => {
            if (!oldChannel && newChannel) {
                logmodule.voiceEnter(user, newChannel, tag);
            } else if (oldChannel && !newChannel) {
                logmodule.voiceExit(user, oldChannel, tag);
            } else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
                logmodule.voiceChange(user, newChannel, tag);
            }
        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}

module.exports = { Log };
