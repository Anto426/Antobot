import LogStartup from "../../../class/console/LogStartup.js";
import LoadOtherModules from "../../../class/Module/LoadOtherModules.js";
import BotConsole from "../../../class/console/BotConsole.js";

export default {
  name: "OnStartUp",
  eventType: "ready",
  allowevents: true,
  async execute() {
    BotConsole.success("Bot is ready to go!");

    await LoadOtherModules.load();
    new LogStartup().log();
  },
};
