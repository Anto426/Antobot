module.exports = {
    name: "voiceStateUpdate",
    typeEvent: "voiceStateUpdate",
    async execute(oldState, newState) {
        if (oldState.member.id === client.user.id && oldState.channel && !newState.channel) {
            await setQueueingPlaylist(false);

            const queue = distube.getQueue(oldState.guild);
            if (queue) {
                await distube.setRepeatMode(oldState.guild, RepeatMode.DISABLED);
                await queue.stop();
            }
            return;
        }

        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        if (newChannel && newChannel.members.has(client.user.id)) {
            if (leaveTimeout) {
                clearTimeout(leaveTimeout);
                leaveTimeout = null;
            }
            return;
        }

        if (oldChannel && oldChannel.members.size === 1 && oldChannel.members.has(client.user.id)) {
            const queue = distube.getQueue(oldChannel.guild);
            if (!queue) return;

            const guildId = oldChannel.guild.id;
            const channelId = oldChannel.id;

            leaveTimeout = setTimeout(async () => {
                const guild = client.guilds.cache.get(guildId);
                const channel = guild ? guild.channels.cache.get(channelId) : null;

                if (channel && channel.members.size === 1) {
                    await setQueueingPlaylist(false);
                    const queue = distube.getQueue(guild);
                    if (queue) {
                        await distube.setRepeatMode(guild, RepeatMode.DISABLED);
                        await queue.stop();
                    }
                    const voice = queue.voiceChannel;
                    if (voice) {
                        await queue.stop()
                        await disableButtons(client, queue)
                        await queue.voice.leave()
                    }
                }
            }, 180000);
        }
    }
}
