import LogStartup from "../../../class/console/LogStartup.js";
import LoadOtherModules from "../../../class/Module/LoadOtherModules.js";

export default {
  name: "OnStartUp",
  eventType: "ready",
  allowevents: true,
  async execute() {
    await LoadOtherModules.load();
    new LogStartup().log();
  },
};
