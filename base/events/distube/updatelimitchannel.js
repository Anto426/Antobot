const { ChannelType } = require("discord.js");

module.exports = {
    name: "updatelimitchannel",
    typeEvent: "voiceStateUpdate",
    allowevents: true,
    async execute(oldState, newState) {
        const channel = newState.channel || oldState.channel;

        if (!channel || channel.type !== ChannelType.GuildVoice) return;

        const limit = channel.userLimit;

        if (newState.member.id === newState.guild.members.me.id && !oldState.channel) {
            if (limit > 0)
                await channel.setUserLimit(limit + 1);
        }
        else if (newState.member.id === newState.guild.members.me.id && (oldState.channel || newState.channel !== oldState.channel)) {
            console.log("User joined or left a channel");
            if (limit > 0) {
                await channel.setUserLimit(limit - 1);
            }
        }
    }
};
