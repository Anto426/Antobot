import ApplicationManager from "../../../class/client/ApplicationManager.js";
export default {
  name: "OnStartUp",
  eventType: "ready",
  isActive: true,
  async execute() {
    ApplicationManager.launch();
  },
};
