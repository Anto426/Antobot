import fs from "fs/promises";
import fetch from "node-fetch";
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
      throw new Error("JSON string is required");
    }

    this.#data = JSON.parse(jsonString);
    return this.#data;
  }

  stringify(data = this.#data, pretty = false) {
    if (!data) {
      throw new Error("Data is required");
    }

    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  getValue(path) {
    if (!path || !this.#data) return undefined;
    return path.split(".").reduce((obj, key) => obj?.[key], this.#data);
  }

  setValue(path, value) {
    if (!path) throw new Error("Path is required");

    this.#data ??= {};
    const keys = path.split(".");
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
    const jsonString = await fs.readFile(filePath, "utf-8");
    return this.parse(jsonString);
  }

  async writeToFile(filePath, pretty = false) {
    if (!this.#data) {
      throw new Error("Data is required");
    }

    const jsonString = this.stringify(this.#data, pretty);
    await fs.writeFile(filePath, jsonString, "utf-8");
  }

  async readFromUrl(url, token = null) {
    const headers = {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const jsonString = await response.text();
    return this.parse(jsonString);
  }
}

export default JsonHandler;
