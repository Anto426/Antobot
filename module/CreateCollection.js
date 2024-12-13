import fs from 'fs';
import { Collection } from 'discord.js';
import { ERROR_CODE } from '../class/error/ErrorHandler.js';


class CreateCollection {
    constructor() {
        this.collection = new Collection();
    }

    async createCollection(root, extension) {
        try {
            const files = this.getFilesRecursively(root, extension);
            await Promise.all(files.map(file => this.loadFile(file)));
            return this.collection;
        } catch (error) {
            throw ERROR_CODE.modules.base.commands; // Using MODULE_BASE_COMMAND_ERROR
        }
    }

    getFilesRecursively(dir, extension) {
        try {
            const files = [];
            const items = fs.readdirSync(dir, { withFileTypes: true });

            for (const item of items) {
                const path = `${dir}/${item.name}`;
                if (item.isDirectory()) {
                    files.push(...this.getFilesRecursively(path, extension));
                } else if (item.name.endsWith(extension)) {
                    files.push(path);
                }
            }
            return files;
        } catch (error) {
            throw ERROR_CODE.services.json.file.read; // Using SERVICE_JSON_FILE_READ_ERROR
        }
    }

    async loadFile(filePath) {
        try {
            const file = await import(filePath);
            if (file?.name) {
                this.collection.set(file.name, file);
            }
        } catch (error) {
            throw ERROR_CODE.services.moduleLoader.commands; // Using SERVICE_MODULE_COMMANDS_ERROR
        }
    }
}

export default CreateCollection;