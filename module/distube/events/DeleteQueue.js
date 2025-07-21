import BotConsole from "../../../class/console/BotConsole.js";

export default {
  name: "DeleteQueue",
  eventType: "deleteQueue",
  isActive: true,

  async execute(queue) {
    if (queue.updateTimeouts) {
      queue.updateTimeouts.forEach((timeout) => clearTimeout(timeout));
    }

    BotConsole.info(
      `Coda pulita per il server: ${queue.textChannel.guild.name}.`
    );
  },
};
