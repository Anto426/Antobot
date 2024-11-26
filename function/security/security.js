const { ChannelType } = require("discord.js");
const { BotConsole } = require("../log/botConsole");


class Security {
    constructor(interaction, command, owner, guildconfig) {

        this.botconsole = new BotConsole();

        this.command = command;
        this.interaction = interaction;
        this.ownerlist = owner;
        this.channelallow = guildconfig;

        // variabili di controllo
        this.owner = false;
        this.serverOwner = false;
        this.staff = false;
        this.position = false;
        this.channel = false;
        this.isBot = false;
        this.isYou = false;
        this.codeErr = errorIndex;
    }

    checkOwner() {
        this.owner = this.ownerlist.includes(this.interaction.member.id);
    }

    checkServerOwner() {
        this.serverOwner = this.interaction.guild.ownerId === this.interaction.member.id;
    }

    checkChannel() {
    
        this.channel = this.channelallow.length === 0 || this.channelallow.includes(this.interaction.channel.id);
    }

    checkPermission() {
        if (this.command.permisions.length > 0) {
            const permcount = this.command.permisions.filter(permission => this.interaction.member.permissions.has(permission)).length;
            this.staff = permcount === this.command.permisions.length;
        } else {
            this.staff = true;
        }
    }

    checkPosition() {
        const otherUser = this.interaction.options.getMember("user");
        if (otherUser) {
            const UserhighestRole = this.interaction.member.roles.highest;
            const otherUserhighestRole = otherUser.roles.highest;
            this.position = UserhighestRole.rawPosition > otherUserhighestRole.rawPosition;
        }
    }

    checkIsYou() {
        const otherUser = this.interaction.options.getMember("user");
        this.isYou = otherUser && this.interaction.member.id === otherUser.id;
    }

    checkIsBot() {
        this.isBot = this.interaction.member.user.bot;
    }

    checkDistube() {
        const voiceChannel = this.interaction.member.voice.channel;
        const botVoiceChannel = this.interaction.guild.channels.cache.find(x => x.type === ChannelType.GuildVoice && x.members.has(client.user.id));
        let result = [voiceChannel, botVoiceChannel];

        if (this.command.disTube.checkchannel) {
            if (!voiceChannel) {
                result = this.codeErr.REPLY_ERRORS.NOT_IN_VOICE_CHANNEL_ERROR;
            } else if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id) {
                result = this.codeErr.REPLY_ERRORS.MUSIC_ALREADY_PLAYING_ERROR;
            }
        }
        if (this.command.disTube.checklisttrack && !distube.getQueue(this.interaction)) {
            result = this.codeErr.REPLY_ERRORS.LIST_TRACK_ERROR;
        }
        if (Array.isArray(result)) {
            return result;
        } else {
            throw result;
        }
    }

    async allowCommand() {
        return new Promise(async (resolve, reject) => {
            try {

                try {
                    this.checkOwner();
                    this.checkServerOwner();
                    this.checkPermission();
                    this.checkPosition();
                    this.checkIsYou();
                    this.checkIsBot();
                    this.checkChannel();
                } catch (error) {
                    console.error("Error during checks:", error);
                    reject(error);
                }


                this.botconsole.log(
                    `Comando richiesto da: ${this.interaction.member.user.username} con id: ${this.interaction.member.id}, 
                    nel canale: ${this.interaction.channel.name} con id: ${this.interaction.channel.id}. 
                    Stato verifica: owner ${this.owner}, serverOwner ${this.serverOwner}, staff ${this.staff}, 
                    position ${this.position}, isYou ${this.isYou}, isBot ${this.isBot}, channel ${this.channel}`, 
                    "yellow"
                );

                if (this.command.OnlyOwner) {
                    if (this.owner) {
                        if (!this.isYou && !this.isBot) {
                            resolve(this.command.type === "Distube" ? await this.checkDistube() : 0);
                        } else {
                            reject(this.isBot ? this.codeErr.REPLY_ERRORS.BOT_USER_ERROR : this.codeErr.REPLY_ERRORS.SELF_USER_ERROR);
                        }
                    } else {
                        reject(this.codeErr.REPLY_ERRORS.OWNER_ERROR);
                    }
                } else {
                    if (this.serverOwner || this.owner) {
                        if (!this.isYou && !this.isBot) {
                            resolve(this.command.type === "Distube" ? await this.checkDistube() : 0);
                        } else {
                            reject(this.isBot ? this.codeErr.REPLY_ERRORS.BOT_USER_ERROR : this.codeErr.REPLY_ERRORS.SELF_USER_ERROR);
                        }
                    } else if (this.staff) {
                        if (this.position && !this.isBot && !this.isYou && this.channel) {
                            resolve(this.command.type === "Distube" ? await this.checkDistube() : 0);
                        } else {
                            reject(this.isBot ? this.codeErr.REPLY_ERRORS.BOT_USER_ERROR : this.isYou ? this.codeErr.REPLY_ERRORS.SELF_USER_ERROR : this.position ? this.codeErr.REPLY_ERRORS.CHANNEL_ERROR : this.codeErr.REPLY_ERRORS.HIGH_PERMISSION_ERROR);
                        }
                    } else {
                        reject(this.codeErr.REPLY_ERRORS.NOT_PERMISSION_ERROR);
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = {
    Security
};
