const { ChannelType } = require("discord.js");
const { errorIndex } = require("../../function/err/errormenager");

class Security {
    constructor(interaction, command, owner, guildconfig) {
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

    async checkOwner() {
        if (this.ownerlist.includes(this.interaction.member.id)) {
            this.owner = true;
        }
    }

    async checkServerOwner() {
        if (this.interaction.guild.ownerId === this.interaction.member.id) {
            this.serverOwner = true;
        }
    }

    async checkChannel() {
        if (this.channelallow.length > 0) {
            if (this.channelallow.includes(this.interaction.channel.id)) {
                this.channel = true;
            }
        } else {
            this.channel = true;
        }
    }

    async checkPermission() {
        if (this.command.permisions.length > 0) {
            let permcount = 0;
            this.command.permisions.forEach(element => {
                if (this.interaction.member.permissions.has(element)) {
                    permcount++;
                }
            });
            if (permcount === this.command.permisions.length) {
                this.staff = true;
            }
        } else {
            this.staff = true;
        }
    }

    async checkPosition() {
        let User = this.interaction.member;
        let otherUser = this.interaction.options.getMember("user");
        if (otherUser) {
            const UserhighestRole = User.roles.highest;
            const otherUserhighestRole = otherUser.roles.highest;

            if (UserhighestRole.rawPosition > otherUserhighestRole.rawPosition) {
                this.position = true;
            }
        }
    }

    async checkIsYou() {
        let otherUser = this.interaction.options.getMember("user");
        if (otherUser && this.interaction.member.id === otherUser.id) {
            this.isYou = true;
        }
    }

    async checkIsBot() {
        if (this.interaction.member.user.bot) {
            this.isBot = true;
        }
    }

    async checkDistube() {
        let result = [this.interaction.member.voice.channel, this.interaction.guild.channels.cache.find(x => x.type === ChannelType.GuildVoice && x.members.has(client.user.id))];

        if (this.command.disTube.checkchannel) {
            if (!result[0]) {
                result = this.codeErr.NOT_IN_VOICE_CHANNEL_ERROR;
            } else if (result[1] && result[0].id !== result[1].id) {
                result = this.codeErr.MUSIC_ALREADY_PLAYING_ERROR;
            }
        }
        if (this.command.disTube.checklisttrack && !distube.getQueue(this.interaction)) {
            result = this.codeErr.LIST_TRACK_ERROR;
        }
        if (Array.isArray(result)) {
            return result;
        } else {
            throw result;
        }
    }

    async allowCommand() {

        await this.checkOwner();
        await this.checkServerOwner();
        await this.checkPermission();
        await this.checkPosition();
        await this.checkIsYou();
        await this.checkIsBot();
        await this.checkChannel();


        if (this.command.OnlyOwner) {
            if (this.owner) {
                if (!this.isYou && !this.isBot) {
                    if (this.command.type === "Distube") {
                        return await this.checkDistube();
                    } else {
                        return 0;
                    }
                } else {
                    throw this.isBot ? this.codeErr.BOT_USER_ERROR : this.codeErr.SELF_USER_ERROR;
                }
            } else {
                throw this.codeErr.OWNER_ERROR;
            }
        } else {
            if (this.serverOwner || this.owner) {
                if (!this.isYou && !this.isBot) {
                    if (this.command.type === "Distube") {
                        return await this.checkDistube();
                    } else {
                        return 0;
                    }
                } else {
                    throw this.isBot ? this.codeErr.BOT_USER_ERROR : this.codeErr.SELF_USER_ERROR;
                }
            } else if (this.staff) {
                if (this.position && !this.isBot && !this.isYou && this.channel) {
                    if (this.command.type === "Distube") {
                        return await this.checkDistube();
                    } else {
                        return 0;
                    }
                } else {
                    throw this.isBot ? this.codeErr.BOT_USER_ERROR : this.isYou ? this.codeErr.SELF_USER_ERROR : this.position ? this.codeErr.CHANNEL_ERROR : this.codeErr.HIGH_PERMISSION_ERROR;
                }
            } else {
                throw this.codeErr.NOT_PERMISSION_ERROR;
            }
        }
    }
}

module.exports = {
    Security
};