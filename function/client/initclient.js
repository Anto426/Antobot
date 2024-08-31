

const OpenAI = require('openai');
const { Client, Partials } = require('discord.js');
const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { Check } = require('../check/check');
const { Cjson } = require('../file/json');
const setting = require("./../../setting/settings.json");
const { BotConsole } = require('../log/botConsole');

class ClientInit {

    constructor() {
        this.check = new Check()
        this.json = new Cjson()
    }

    async initializeClientBase() {

        return new Promise(async (resolve, reject) => {

            try {
                global.client = new Client({
                    intents: 3276799,
                    partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
                })

                global.embedconfig = {}

                await this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[5], process.env.GITTOKEN).then((jsonf) => { embedconfig = jsonf }).catch(() => { new BotConsole().log("Errore variabile json non caricata", "red") });


                new BotConsole().log("Client di base inizializzato con successo", "green");

                resolve(0);


            } catch (err) {
                new BotConsole().log("Errore nell'inizializzare il client di base", "red");
                reject(err);
            }
        })
    }


    async initializeClientAI() {
        return new Promise(async (resolve, reject) => {

            try {

                global.openai = new OpenAI({
                    apiKey: process.env.OPENAITOKEN
                });
                new BotConsole().log("Client di AI inizializzato con successo", "green");
                resolve(0)

            } catch (err) {
                new BotConsole().log("Errore nell'inizializzare il client di AI", "red");
                reject(err);
            }
        })

    }


    async initializeClientMusic() {
        return new Promise(async (resolve, reject) => {

            try {
                this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[7], process.env.GITTOKEN)
                    .then((cookies) => {
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
                                new YtDlpPlugin(
                                    {
                                        cookies: [
                                            {
                                                cookies: cookies.youtube,
                                            }
                                        ]
                                    }
                                )
                            ],
                            customFilters: {
                                'bassboost': 'bass=g=10',
                                '8D': 'apulsator=hz=0.08',
                                'vaporwave': 'aresample=48000,asetrate=48000*0.8',
                                'nightcore': 'aresample=48000,asetrate=48000*1.25',
                                'phaser': 'aphaser=in_gain=0.4',
                                'tremolo': 'tremolo',
                                'vibrato': 'vibrato=f=6.5',
                                'reverse': 'areverse',
                                'treble': 'treble=g=5',
                                'normalizer': 'dynaudnorm=g=101',
                                'surrounding': 'surround',
                                'pulsator': 'apulsator=hz=1',
                                'subboost': 'asubboost',
                                'karaoke': 'stereotools=mlev=0.03',
                                'flanger': 'flanger',
                                'gate': 'agate',
                                'haas': 'haas',
                                'mcompand': 'mcompand',
                                'earwax': 'earwax',
                            },
                            ytdlOptions: {
                                quality: 'highestaudio',
                                highWaterMark: 1 << 25,
                                filter: 'audioonly',
                            },
                        })
                        new BotConsole().log("Client di Distube inzializato con successo", "green");
                        resolve(0)

                    }).catch(() => { new BotConsole().log("Errore variabile json non caricata", "red") });
            } catch (err) {
                new BotConsole().log("Errore nel inizializare il client di Distube", "red");
                reject(err);
            }
        })

    }

    async intitialallclientbysettings() {
        return new Promise(async (resolve, reject) => {

            try {
                this.initializeClientBase().then(() => {
                    this.check.checkAllowDistube().then(async () => { await this.initializeClientMusic().catch(() => { }) }).catch(() => { })
                    this.check.checkAllowOpenAI().then(async () => { await this.initializeClientAI().catch(() => { }) }).catch(() => { })
                    resolve(0)
                }).catch(() => {
                    reject(-1);
                })
            } catch (err) {
                new BotConsole().log("Errore nel inizializare il i client", "red");
                reject(err);
            }
        })

    }



}




module.exports = { ClientInit }