const express = require('express');
const { BotConsole } = require("../function/log/botConsole");
const { log } = require('../function/log/log');
const { GitFun } = require('../function/Git/GitFun');
const fetch = require('node-fetch');
const sharp = require('sharp');



class serverUpdate {

    constructor() {
        this.log = new log();
        this.botconsole = new BotConsole();
        this.app = new express();
        this.GitFun = new GitFun();
        this.app.use(express.json());
        this.port = 3000;
    }


    async processAvatar(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch avatar');

        const buffer = await response.buffer();
        if (buffer.length > 256 * 1024) {
            const resizedBuffer = await sharp(buffer)
                .resize(128, 128)
                .toFormat('png', { quality: 80 })
                .toBuffer();

            return resizedBuffer;
        }
        return buffer;
    }


    init() {
        return new Promise((resolve, reject) => {
            try {
                this.app.post('/webhook', async (req, res) => {
                    res.status(200).send('Webhook processed');

                    const authors = [...new Set(req.body.commits.map(commit => commit.author))];
                    const commits = req.body.commits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    const emoji = await client.application?.emojis.fetch()
                    const emojiMap = emoji.map(emoji => ({
                        id: emoji.id,
                        name: emoji.name,
                    }));

                    for (const author of authors) {
                        try {
                            const userData = await this.GitFun.FetchDataUSER(author.name);
                            const processedBuffer = await this.processAvatar(userData.avatar_url);
                            await client.application?.emojis.create({
                                attachment: processedBuffer,
                                name: author.name,
                            });
                        } catch (err) {
                            console.error(`Error processing author ${author.name}: ${err.message}`);
                        }
                    }

                    this.log.init()
                        .then(() => this.log.UpdateRecived(commits, authors, emojiMap))
                        .catch(() => console.error("Errore nell'inizializzare il modulo log"));
                });
                resolve(0);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    StartServer() {
        return new Promise((resolve, reject) => {
            try {
                this.app.listen(this.port, () => {
                    this.botconsole.log(`Server in ascolto sulla porta ${this.port}`, "green");
                });
                resolve(0);
            } catch (error) {
                reject(error);
            }
        });
    }


}

module.exports = {
    serverUpdate
}