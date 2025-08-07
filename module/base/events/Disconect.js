import BotConsole from "../../../class/console/BotConsole.js";
import { Events } from "discord.js";

export default {
  name: "Disconnect",
  eventType: Events.VoiceStateUpdate,
  isActive: true,

  async execute(oldState, newState) {
    const botMember = oldState.guild.members.me;
    const botChannel = botMember?.voice?.channel;

    if (!botChannel) return;

    const botChannelId = botChannel.id;

    if (
      oldState.channelId !== botChannelId ||
      newState.channelId === botChannelId
    )
      return;

    const channel = oldState.channel;

    if (
      channel &&
      channel.members.size === 1 &&
      channel.members.first()?.id === botMember.id &&
      global.distube
    ) {
      const queue = global.distube.getQueue(oldState.guild.id);
      queue.voice.leave();
      BotConsole.debug(
        `[Disconnect] Bot solo in ${channel.name}. Disconnesso correttamente.`
      );
    }
  },
};
