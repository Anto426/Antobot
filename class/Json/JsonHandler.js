import fs from 'fs/promises';
import fetch from 'node-fetch';

class JsonHandler {

    constructor() {
        this.data = null;
    }

    // Parse JSON string to object
    parse(jsonString) {
        try {
            this.data = JSON.parse(jsonString);
            return this.data;
        } catch (error) {
            throw new Error(`Failed to parse JSON: ${error.message}`);
        }
    }

    // Convert object to JSON string
    stringify(data = this.data, pretty = false) {
        try {
            return pretty
                ? JSON.stringify(data, null, 2)
                : JSON.stringify(data);
        } catch (error) {
            throw new Error(`Failed to stringify JSON: ${error.message}`);
        }
    }

    // Get value by key path (e.g., "user.address.city")
    getValue(path) {
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), this.data);
    }

    // Set value by key path
    setValue(path, value) {
        if (!this.data) this.data = {};

        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key] || typeof obj[key] !== 'object') obj[key] = {};
            return obj[key];
        }, this.data);

        target[lastKey] = value;
        return this.data;
    }

    // Clear stored data
    clear() {
        this.data = null;
    }

    async readFromFile(filePath) {
        try {
            const jsonString = await fs.readFile(filePath, 'utf-8');
            return this.parse(jsonString);
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }

    async writeToFile(filePath, pretty = false) {
        try {
            const jsonString = this.stringify(this.data, pretty);
            await fs.writeFile(filePath, jsonString, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write file: ${error.message}`);
        }
    }

    async readFromUrl(url, token = null) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            };


            if (token) {
                options.headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonString = await response.text();
            return this.parse(jsonString);
        } catch (error) {
            throw new Error(`Failed to read URL: ${error.message}`);
        }
    }
}

export default JsonHandler;
