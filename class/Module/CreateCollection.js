import fs from 'fs';
import { Collection } from 'discord.js';
import { ERROR_CODE } from '../error/ErrorHandler.js';

class CreateCollection {
    #collection;

    constructor() {
        this.#collection = new Collection();
    }

    async createCollection(root, extension) {
        if (!root || !extension) {
            throw ERROR_CODE.system.error.handling;
        }

        try {
            if (!fs.existsSync(root)) {
                throw ERROR_CODE.system.path.resolution;
            }

            const files = this.getFilesRecursively(root, extension);
            await Promise.all(
                files.map(file => this.loadFile(file).catch(error => {
                    console.error(`Failed to load file ${file}:`, error);
                    return null;
                }))
            );

            return this.#collection;
        } catch (error) {
            console.error('Collection creation failed:', error);
            throw ERROR_CODE.modules.base.commands;
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
                } else if (item.isFile() && item.name.endsWith(extension)) {
                    files.push(path);
                }
            }

            return files;
        } catch (error) {
            console.error('File reading failed:', error);
            throw ERROR_CODE.services.json.file.read;
        }
    }

    async loadFile(filePath) {
        try {
            const file = await import(filePath);
            
            if (!file?.name || typeof file.name !== 'string') {
                console.warn(`Skipping invalid file ${filePath}: Missing or invalid name property`);
                return;
            }

            this.#collection.set(file.name, file);
        } catch (error) {
            console.error(`Module loading failed for ${filePath}:`, error);
            throw ERROR_CODE.services.moduleLoader.commands;
        }
    }

    getCollection() {
        return this.#collection;
    }
}

export default CreateCollection;
