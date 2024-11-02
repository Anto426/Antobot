const OpenAI = require('openai');
const { Client, Partials } = require('discord.js');
const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { Check } = require('../check/check');
const { Cjson } = require('../file/json');
const setting = require("./../../setting/settings.json");
const { BotConsole } = require('../log/botConsole');
const { default: DeezerPlugin } = require('@distube/deezer');
const { YouTubePlugin } = require('@distube/youtube');

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
                    partials: [
                        Partials.Channel,
                        Partials.GuildMember,
                        Partials.ThreadMember,
                        Partials.User,
                        Partials.Message,
                        Partials.Reaction
                    ]
                })

                global.embedconfig = await this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[5], process.env.GITTOKEN).catch(() => { new BotConsole().log("Impossibile importare la configurazione degli embed") });
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

            this.check.checkAllowOpenAI().then(() => {
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


            }).catch(() => { new BotConsole().log("Modulo OpenAI non abilitato per impostazione", "yellow"); resolve(0) })

        })

    }


    async initializeClientMusic() {
        return new Promise(async (resolve, reject) => {

            this.check.checkAllowDistube().then(() => {

                try {
                    this.json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[7], process.env.GITTOKEN)
                        .then((cookies) => {

                            global.distube = new DisTube(client, {
                                emitNewSongOnly: false,
                                emitAddSongWhenCreatingQueue: false,
                                plugins: [
                                    new YouTubePlugin({
                                        cookies: cookies.youtube
                                    }),
                                    new SoundCloudPlugin(),
                                    new SpotifyPlugin(),
                                    new DeezerPlugin(),
                                ],
                                customFilters: {
                                    // Effetti di spazialità
                                    "3D": "apulsator=hz=0.125",
                                    "8D": "apulsator=hz=0.08",
                                    "Stereo": "extrastereo",
                                    "Stereo Swap": "extrastereo=m=-1",
                                    "Wide Stereo": "extrastereo=w=2", // Stereo più ampio
                                
                                    // Effetti di panoramica
                                    "Pan Left": "stereotools=mpan=-0.75",
                                    "Pan Middle": "stereotools=mpan=0",
                                    "Pan Right": "stereotools=mpan=0.75",
                                
                                    // Equalizzazione e bassi
                                    "Low Bass": "bass=g=-20",
                                    "Light Bass": "bass=g=4",
                                    "Heavy Bass": "bass=g=8",
                                    "Max Bass": "bass=g=20",
                                    "Subboost": "asubboost=boost=12",
                                
                                    // Compressore per enfatizzare la dinamica
                                    "Phonk": "acompressor=level_in=4:mode=upward",
                                    "Concert": "acompressor=level_in=8",
                                
                                    // Effetti di voce
                                    "Vocals (1)": "speechnorm=e=12.5:r=0.0001:l=1",
                                    "Vocals (2)": "speechnorm=e=25:r=0.0001:l=1",
                                    "Vocals (3)": "speechnorm=e=50:r=0.0001:l=1",
                                
                                    // Effetti di riverbero ed eco
                                    "Echo": "aecho=0.8:0.9:1000:0.3",
                                    "Long Echo": "aecho=0.8:0.9:2000:0.4", // Eco più lungo
                                    "Reverb": "aecho=0.8:0.9:500:0.5", // Riverbero generico
                                
                                    // Effetti di modulazione
                                    "Flanger": "flanger=delay=20:depth=10",
                                    "Chorus": "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.39",
                                    "Phaser": "aphaser=in_gain=0.4:out_gain=0.7:delay=3:decay=0.4:depth=3:speed=1.2",
                                    "Shiver": "tremolo=f=8",
                                    "Funny": "vibrato=f=8",
                                    "Crying": "vibrato=f=8:d=1",
                                
                                    // Effetti di risintonizzazione
                                    "Vaporwave": "aresample=48000,asetrate=48000*0.8",
                                    "Nightcore": "aresample=48000,asetrate=48000*1.2",
                                
                                    // Equalizzazione aggiuntiva
                                    "Sharp": "treble=g=10",
                                    "Warm": "bass=g=5:treble=g=-2", // Aggiunta di calore con bassi e riduzione degli alti
                                    "Clarity": "treble=g=5", // Schiarimento delle alte frequenze
                                
                                    // Filtri di frequenza
                                    "44.1kHz": "aresample=44100",
                                    "Smooth": "adynamicsmooth",
                                    "Flat": "asuperpass=level=2"
                                }
                                

                            });
                            new BotConsole().log("Client di Distube inzializato con successo", "green");
                            resolve(0)

                        }).catch(() => { new BotConsole().log("Errore impossibile importare i cookies", "red") });
                } catch (err) {
                    new BotConsole().log("Errore nel inizializare il client di Distube", "red");
                    reject(err);
                }
            }).catch(() => {
                new BotConsole().log("Modulo distube non abilitato per impostazione", "yellow");
                resolve(0)
            })

        })

    }

    async intitialallclientbysettings() {
        return new Promise(async (resolve, reject) => {
            this.initializeClientBase().then(async () => {
                await this.initializeClientMusic().catch(() => { })
                await this.initializeClientAI().catch(() => { })
                resolve(0)
            }).catch((err) => {
                console.log(err)
                this.BotConsole.log("Non ho inizializzato nessun client", "red");
                reject(-1)
            })

        })
    }


}








module.exports = { ClientInit }