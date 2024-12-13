import { ERROR_CODE } from '../error/ErrorHandler.js';
import BotConsole from '../console/BotConsole.js';

class LoadOtherModules {
    #console;
    #check;
    #serverUpdate;

    constructor() {
        this.#console = BotConsole;
    }

    async load() {
        try {
            this.#console.info('Starting to load modules...');

            await this.#initializeServer();
            await this.#initializeStatus();
            await this.#initializeHoliday();

            this.#console.success('All modules loaded successfully');
        } catch (error) {
            this.#console.error('Failed to load modules:', error);
            throw ERROR_CODE.services.moduleLoader.commands;
        }
    }

    async #initializeServer() {
        try {
            const { serverUpdate } = await import("../../webhook/serverUpdate.js");
            this.#serverUpdate = new serverUpdate();
            await this.#serverUpdate.init();
            await this.#serverUpdate.StartServer();
            this.#console.success('Server module initialized');
        } catch (error) {
            this.#console.error('Server initialization failed:', error);
            throw ERROR_CODE.core.initialization.system.config;
        }
    }

    async #initializeStatus() {
        try {
            const { Check } = await import("../check/check.js");
            this.#check = new Check();
            
            if (!await this.#check.checkAllowStatus()) {
                this.#console.info('Status module is disabled');
                return;
            }

            const { Status } = await import("../status/status.js");
            global.client.statusmodule = new Status();
            global.client.statusmodule.updateStatus();
            global.client.statusmodule.updateStatusEveryFiveMinutes();
            this.#console.success('Status module initialized');
        } catch (error) {
            this.#console.error('Status module initialization failed:', error);
            throw ERROR_CODE.modules.base.events;
        }
    }

    async #initializeHoliday() {
        try {
            if (!this.#check) {
                const { Check } = await import("../check/check.js");
                this.#check = new Check();
            }

            if (!await this.#check.checkAllowHoliday()) {
                this.#console.info('Holiday module is disabled');
                return;
            }

            const { Holiday } = await import("../holiday/holiday.js");
            global.client.holidaymodule = new Holiday();
            await global.client.holidaymodule.init();
            global.client.holidaymodule.main();
            this.#console.success('Holiday module initialized');
        } catch (error) {
            this.#console.error('Holiday module initialization failed:', error);
            throw ERROR_CODE.modules.base.events;
        }
    }
}

export default new LoadOtherModules();
