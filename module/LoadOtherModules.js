import { serverUpdate } from "../../webhook/serverUpdate";
import { Check } from "../check/check";
import { Holiday } from "../hollyday/hollyday";
import { BotConsole } from "../log/botConsole";
import { Status } from "../status/status";
import { ERROR_CODE } from '../class/error/ErrorHandler';

class LoadOtherModules {
    constructor() {
        this.botConsole = new BotConsole();
        this.check = new Check();
        this.serverUpdate = new serverUpdate();
    }

    async load() {
        try {
            client.holidaymodule = new Holiday();
            client.statusmodule = new Status();

            await this.initializeServer();
            await this.initializeStatus();
            await this.initializeHoliday();
        } catch (error) {
            throw ERROR_CODE.services.moduleLoader.commands; // ID: 2102
        }
    }

    async initializeServer() {
        try {
            await this.serverUpdate.init();
            this.botConsole.log("Server initialized", "green");
            this.serverUpdate.StartServer();
        } catch (error) {
            throw ERROR_CODE.core.initialization.system.config; // ID: 1101
        }
    }

    async initializeStatus() {
        try {
            if (await this.check.checkAllowStatus()) {
                this.botConsole.log("Status module loaded", "green");
                client.statusmodule.updateStatus();
                client.statusmodule.updateStatusEveryFiveMinutes();
            }
        } catch (error) {
            throw ERROR_CODE.modules.base.events; // ID: 3002
        }
    }

    async initializeHoliday() {
        try {
            if (await this.check.checkAllowHoliday()) {
                this.botConsole.log("Holiday module loaded", "green");
                await client.holidaymodule.init();
                client.holidaymodule.main();
            }
        } catch (error) {
            throw ERROR_CODE.modules.base.events; // ID: 3002
        }
    }
}


const loadothermodules = new LoadOtherModules();
export { loadothermodules };
