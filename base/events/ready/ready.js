const { WriteCommand } = require("../../../function/commands/WriteCommand");
const { Loadothermodules } = require("../../../function/loadothermodule/loadothermodule");
const { LogStartup } = require("../../../function/log/bootlog");
const { Log } = require("../../../function/log/log");
const { Time } = require("../../../function/time/time");

module.exports = {
    name: "BotReady",
    typeEvent: "ready",
    allowevents: true,
    async execute() {
        console.log("Bot is ready");
        try {
            let time = new Time('Europe/Rome');
            let log = new Log();
            let writecommand = new WriteCommand();
            let loadothermodules = new Loadothermodules();
            global.Timeon = time.getCurrentTimestamp();
            new LogStartup().log();
            await log.init();
            await writecommand.commandAllguildonstartup();
            loadothermodules.load();
        } catch (error) {
            console.error(error);
        }
    } 
};