
const fs = require("fs")
const { Collection } = require("discord.js");


class CreateCollection {

    constructor() {
        this.tempCollection = new Collection();
    }

    createCollection(root, extensions) {
        return new Promise((resolve) => {
            let promises = [];
            let folders = fs.readdirSync(root);

            folders.forEach(element => {
                let filePath = root + "/" + element;
                let stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    promises.push(this.createCollection(filePath, extensions));
                } else {
                    if (filePath.endsWith(extensions)) {
                        try {
                            let file = require(filePath);
                            if (file && file.name) {
                                this.tempCollection.set(file.name, file);
                            }
                        } catch (error) {
                            console.error("Error loading file: " + filePath + ":" + error);
                        }
                    }
                }
            });

            Promise.all(promises)
                .then(() => {
                    resolve(this.tempCollection);
                })
        });
    }
}











module.exports = { CreateCollection }
