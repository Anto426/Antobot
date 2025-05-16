import LogStartup from "../../../class/console/LogStartup.js";
import BotConsole from "../../../class/console/BotConsole.js";
import IntitialOtherModules from "../../../class/Loader/IntitialOtherModules.js";


export default {
  name: "OnStartUp",
  eventType: "ready",
  allowevents: true,
  async execute() {
    BotConsole.success("Bot is ready to go!");
    await IntitialOtherModules.Intit();
    LogStartup.run();

  },
};
