import fs from 'fs/promises';
import fetch from 'node-fetch';
import { ERROR_CODE } from '../error/ErrorHandler.js';

class JsonHandler {
    #data;

    constructor(initialData = null) {
        this.#data = initialData;
    }

    get data() {
        return this.#data;
    }

    parse(jsonString) {
        if (!jsonString) {
            throw ERROR_CODE.services.json.parse;
        }

        try {
            this.#data = JSON.parse(jsonString);
            return this.#data;
        } catch (error) {
            throw ERROR_CODE.services.json.parse;
        }
    }

    stringify(data = this.#data, pretty = false) {
        if (!data) {
            throw ERROR_CODE.services.json.stringify;
        }

        try {
            return pretty
                ? JSON.stringify(data, null, 2)
                : JSON.stringify(data);
        } catch (error) {
            throw ERROR_CODE.services.json.stringify;
        }
    }

    getValue(path) {
        if (!path || !this.#data) return undefined;
        return path.split('.')
            .reduce((obj, key) => obj?.[key], this.#data);
    }

    setValue(path, value) {
        if (!path) throw new Error('Path is required');
        
        this.#data ??= {};
        const keys = path.split('.');
        const lastKey = keys.pop();
        
        const target = keys.reduce((obj, key) => {
            obj[key] = obj[key] ?? {};
            return obj[key];
        }, this.#data);

        target[lastKey] = value;
        return this.#data;
    }

    clear() {
        this.#data = null;
    }

    async readFromFile(filePath) {
        try {
            const jsonString = await fs.readFile(filePath, 'utf-8');
            return this.parse(jsonString);
        } catch (error) {
            throw ERROR_CODE.services.json.file.read;
        }
    }

    async writeToFile(filePath, pretty = false) {
        if (!this.#data) {
            throw ERROR_CODE.services.json.file.write;
        }

        try {
            const jsonString = this.stringify(this.#data, pretty);
            await fs.writeFile(filePath, jsonString, 'utf-8');
        } catch (error) {
            throw ERROR_CODE.services.json.file.write;
        }
    }

    async readFromUrl(url, token = null) {
        try {
            const headers = {
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const response = await fetch(url, { method: 'GET', headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonString = await response.text();
            return this.parse(jsonString);
        } catch (error) {
            throw ERROR_CODE.services.json.parse;
        }
    }
}

export default JsonHandler;
