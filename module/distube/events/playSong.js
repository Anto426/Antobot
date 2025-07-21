import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";
import BotConsole from "../../../class/console/BotConsole.js";

const UPDATES_PER_SONG = 2;

export default {
  name: "PlaySong",
  eventType: "playSong",
  isActive: true,

  async execute(queue, song) {
    if (queue.updateTimeouts) {
      queue.updateTimeouts.forEach((timeout) => clearTimeout(timeout));
    }
    if (queue.lastPlayingMessage) {
      try {
        await queue.lastPlayingMessage.delete();
      } catch (e) {}
    }

    try {
      const panel = await new NowPlayingPanelBuilder(queue).build();
      const message = await queue.textChannel.send(panel);
      queue.lastPlayingMessage = message;

      const durationMs = song.duration * 1000;
      if (song.isLive || durationMs < 30000) return;

      queue.updateTimeouts = [];
      for (let i = 1; i <= UPDATES_PER_SONG; i++) {
        const delay = (durationMs / (UPDATES_PER_SONG + 1)) * i;

        const timeoutId = setTimeout(() => {
          const currentQueue = client.distube.getQueue(queue.id);
          if (!currentQueue || !currentQueue.lastPlayingMessage) return;

          new NowPlayingPanelBuilder(currentQueue)
            .build()
            .then((newPanel) => currentQueue.lastPlayingMessage.edit(newPanel))
            .catch(() => {});
        }, delay);

        queue.updateTimeouts.push(timeoutId);
      }
    } catch (e) {
      BotConsole.error(
        `[Event: PlaySong] Impossibile creare o inviare il pannello: ${e}`
      );
    }
  },
};
