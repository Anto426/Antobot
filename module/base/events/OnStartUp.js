import LogStartup from "../../../class/console/LogStartup.js";

export default {
  name: "OnStartUp",
  eventType: "ready",
  allowevents: true,
  execute() {
    new LogStartup().log();
  },
};
