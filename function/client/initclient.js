const OpenAI = require('openai');
const { Client, Partials } = require('discord.js');
const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { consolelog } = require('../log/consolelog');
const { check } = require('../check/check');
const { Cjson } = require('../json/json');
const setting = require("./../../setting/settings.json")

class clientinit {

    constructor() {
        this.check = new check()
        this.json = new Cjson()
    }

    async intitialclientbase() {

        return new Promise(async (resolve, reject) => {

            try {
                global.client = new Client({
                    intents: 3276799,
                    partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
                })

                global.embedconfig = {}

                await this.json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[5], process.env.GITTOKEN).then((jsonf) => { embedconfig = jsonf }).catch(() => { consolelog("Errore variabile json non caricata", "red") });
                

                consolelog("Client di base inzializato con successo", "green");

                resolve(0);


            } catch (err) {
                consolelog("Errore nel inizializare il client di base", "red");
                reject(err);
            }
        })
    }


    async intitialclientai() {
        return new Promise(async (resolve, reject) => {

            try {

                global.openai = new OpenAI({
                    apiKey: process.env.OPENAITOKEN
                });
                consolelog("Client di AI inzializato con successo", "green");
                resolve(0)

            } catch (err) {
                consolelog("Errore nel inizializare il client di AI", "red");
                reject(err);
            }
        })

    }


    async intitialclientmusic() {
        return new Promise(async (resolve, reject) => {

            try {
                global.distube = new DisTube(client, {
                    leaveOnStop: true,
                    emitNewSongOnly: true,
                    emitAddSongWhenCreatingQueue: false,
                    emitAddListWhenCreatingQueue: false,
                    plugins: [
                        new SpotifyPlugin({
                            emitEventsAfterFetching: true
                        }),
                        new SoundCloudPlugin(),
                        new YtDlpPlugin()
                    ]
                })
                consolelog("Client di Distube inzializato con successo", "green");
                resolve(0)
            } catch (err) {
                consolelog("Errore nel inizializare il client di Distube", "red");
                reject(err);
            }
        })

    }

    async intitialallclientbysettings() {
        return new Promise(async (resolve, reject) => {

            try {
                this.intitialclientbase().then(() => {
                    this.check.checkallowdistube().then(async () => { await this.intitialclientmusic().catch(() => { }) }).catch(() => { })
                    this.check.checkallowopenai().then(async () => { await this.intitialclientai().catch(() => { }) }).catch(() => { })
                    resolve(0)
                }).catch(() => {
                    reject(-1);
                })
            } catch (err) {
                consolelog("Errore nel inizializare il i client", "red");
                reject(err);
            }
        })

    }



}




module.exports = { clientinit }