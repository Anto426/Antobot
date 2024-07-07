const OpenAI = require('openai');
const { Client, Partials } = require('discord.js');
const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { consolelog } = require('../log/consolelog');
const { check } = require('../check/check');
const { Cjson } = require('../file/json');
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


                consolelog("Client di base inzializzato con successo", "green");

                resolve(0);


            } catch (err) {
                consolelog("Errore nell' inizializzare il client di base", "red");
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
                    },
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