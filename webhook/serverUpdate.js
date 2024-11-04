const express = require('express');
const { BotConsole } = require("../function/log/botConsole");
const { log } = require('../function/log/log');
const { GitFun } = require('../function/Git/GitFun');
const { emojiMenager } = require('../function/emoji/emojiMenager');


class serverUpdate {

    constructor() {
        this.log = new log();
        this.botconsole = new BotConsole();
        this.app = new express();
        this.emojiMenager = new emojiMenager();
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
                    try {


                        if (!req.body.commits || !Array.isArray(req.body.commits) || req.body.commits.length === 0) {
                            return res.status(400).send('No commits found');
                        }

                        if (req.body.ref !== 'refs/heads/host') {
                            return res.status(400).send('Invalid branch');
                        }

                        res.status(200).send('Webhook processed');


                        const authors = [...new Set(req.body.commits.map(commit => commit.author.name))];
                        const commits = req.body.commits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        console.log(authors);
                        const newuserdata = [];

                        for (const author of authors) {
                            try {
                                const userData = await this.GitFun.FetchDataUSER(author);
                                const emojiautor = await this.emojiMenager.findEmoji("dev_" + userData.login);
                                if (emojiautor) {
                                    userData.emoji = await this.emojiMenager.updateEmoji(userData.avatar_url, emojiautor).catch((err) => { console.log(err) });
                                } else {
                                    userData.emoji = await this.emojiMenager.addEmoji(userData.avatar_url, "dev", author.login).catch((err) => { console.log(err) });
                                }
                                newuserdata.push(userData);
                            } catch (error) {
                                console.error(error);
                            }
                        }

                        this.log.init().then(() => {
                            this.log.UpdateRecived(commits, newuserdata);
                        }).catch((err) => { console.log(err) });


                    } catch (error) {
                        console.error(error);
                        res.status(500).send('Internal Server Error');
                    }
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