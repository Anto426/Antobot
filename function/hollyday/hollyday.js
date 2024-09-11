const { Time } = require("../time/time");
const { BotConsole } = require("../log/botConsole");
const setting = require("../../setting/settings.json");
const { Cjson } = require("../file/json");
class Holiday {

    constructor() {
        this.Time = new Time()
        this.Cjson = new Cjson()
        this.hollydayjson = {}
        this.guiljson = {}
        this.arrholiday = []
        this.id = 0
        this.id0 = 0
        this.botconsole = new BotConsole()
        this.year = parseInt(this.Time.getCurrentYear())
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            await this.Cjson.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN)
                .then((json) => { this.guildJson = json }).catch(() => { new BotConsole().log("Errore nell'inizializzare il json " + setting.configjson.online.name[2], "red"); return reject(-1) })
            await this.Cjson.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[3], process.env.GITTOKEN)
                .then((json) => { this.hollydayjson = json; this.arrholiday = this.hollydayjson.holidays }).catch(() => { new BotConsole().log("Errore nell'inizializzare il json " + setting.configjson.online.name[3], "red"); return reject(-1) })
            resolve(0);
        })

    }


    async checkNextHoliday() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.arrholiday.length == 0) {
                    this.botconsole.log("Nessuna festività presente", "yellow")
                    reject(-1)
                } else {
                    let temp = {}

                    for (let i = 0; i < this.arrholiday.length; i++) {
                        let day = this.arrholiday[i].date.day
                        let month = this.arrholiday[i].date.month
                        let date = this.Time.getTimestampByInput(this.year, month, day)
                        let now = this.Time.getCurrentTimestamp()
                        let diff = date - now
                        if (diff > 0) {
                            this.arrholiday[i].timestamp = diff
                            temp = this.arrholiday[i]
                            break
                        }
                    }
                    if (temp != {}) {
                        this.botconsole.log("La prossima festività è " + temp.name + " fra " + this.Time.fortmatTimestamp(temp.timestamp), "yellow")
                        resolve(temp)
                    } else {
                        this.year++
                        resolve(await this.checkNextHoliday())
                    }
                }
            } catch (err) {
                console.log(err)
                this.botconsole.log("Errore nel trovare la festività", "red")
                reject(-1)
            }
        })


    }

    cleartimer() {
        try {
            clearInterval(this.id)
            clearInterval(this.id0)
        } catch (err) {
            console.log(err)
            this.botconsole.log("Errore nel cancellare il timer", "red")
        }
    }

    sendcongratulation(channelcongratulation, holiday) {
        try {
            this.botconsole.log("E' arrivato il giorno della festività " + holiday.name, "green")
            channelcongratulation.send()
            this.cleartimer()
            this.main()
        } catch (err) {
            console.log(err)
            this.botconsole.log("Errore nell'invio del messaggio di congratulazioni", "red")
        }
    }

    async TimeToHoliday(holiday, namechannel, timerchannel, congratulation) {

        try {
            this.id = setInterval(() => {
                let now = this.Time.getCurrentTimestamp()
                let diff = holiday.timestamp - now
                if (diff <= 0) {
                    this.sendcongratulation(congratulation, holiday)
                }
            }, 1000)

            this.id0 = setInterval(() => {
                let now = this.Time.getCurrentTimestamp()
                let diff = holiday.timestamp - now
                if (diff >= 0) {
                    namechannel.setName(holiday.emoji + " " + holiday.name)
                    timerchannel.setName(this.Time.fortmatTimestamp(diff))
                }
            }, 5000)
        } catch (err) {
            console.log(err)
            this.botconsole.log("Errore nel timer", "red")
        }

    }

    async main() {
        this.checkNextHoliday().then((nextHoliday) => {
            client.guilds.cache.forEach((guild) => {
                let info = guildJson[guild.name]
                if (info) {
                    let namechannel = guild.channels.cache.get(info.channel.hollyday.name)
                    let timerchannel = guild.channels.cache.get(info.channel.hollyday.timer)
                    let congratulation = guild.channels.cache.get(info.channel.hollyday.congratulation)
                    if (namechannel && timerchannel && congratulation) {
                        this.TimeToHoliday(nextHoliday, namechannel, timerchannel, congratulation)
                    } else {
                        this.botconsole.log("Non ho trovato i canali", "red")
                    }

                } else {
                    this.botconsole.log("Non posso abbilitare il il modulo holliday per questo server", "red")
                }
            })
        }).catch(() => { })

    }
}


module.exports = { Holiday }