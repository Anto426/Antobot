import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "PlaySong",
  eventType: "playSong",
  isActive: true,

  async execute(queue, song) {
    if (queue.lastPlayingMessage) {
      try {
        await queue.lastPlayingMessage.delete();
      } catch (e) {}
    }
    try {
      const panel = await new NowPlayingPanelBuilder(queue).build();
      const message = await queue.textChannel.send(panel);
      queue.lastPlayingMessage = message;
    } catch (e) {
      console.error(e);
    }
  },
};
