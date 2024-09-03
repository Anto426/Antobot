const { ChannelType } = require("discord.js");
const { isVoiceChannelEmpty } = require("distube");

module.exports = {
    name: "voiceStateUpdate",
    typeEvent: "voiceStateUpdate",
    allowevents: true,
    async execute(oldState, newState) {

        const client = oldState.client || newState.client;
        const guild = oldState.guild ? oldState.guild : newState.guild;

        let channelbot = client.guilds.cache.get(oldState.guild.id)
            .channels.cache.find(channel =>
                channel.type === ChannelType.GuildVoice &&
                channel.members.has(client.user.id)
            );

        if (!channelbot) return;


        if (isVoiceChannelEmpty(channelbot)) {
            const voice = distube.voices.get(channelbot);
            if (voice) {
                const queue = distube.getQueue(guild);
                if (queue) {
                    distube.stop(guild);
                }
                voice.leave();
            }
        }


    }
}
