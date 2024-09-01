const { ChannelType } = require("discord.js");
const { isVoiceChannelEmpty } = require("distube");

module.exports = {
    name: "voiceStateUpdate",
    typeEvent: "voiceStateUpdate",
    async execute(oldState, newState) {
        const client = oldState.client || newState.client;

        let channelbot = client.guilds.cache.get(oldState.guild.id)
            .channels.cache.find(channel => 
                channel.type === ChannelType.GuildVoice && 
                channel.members.has(client.user.id)
            );

        if (!channelbot) return;

        if (isVoiceChannelEmpty(channelbot)) {
            const voice = distube.voices.get(channelbot);
            if (voice) {
                voice.leave();
            }
        }
    }
};
