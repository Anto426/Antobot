import ApplicationManager from "./class/client/ApplicationManager.js";

export default {
  name: "OnStartUp",
  eventType: "ready",
  allowevents: true,
  async execute() {
    ApplicationManager.launch();
  },
};
