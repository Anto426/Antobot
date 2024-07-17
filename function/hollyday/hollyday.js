
const { Cjson } = require("../file/json");
const { Time } = require("../time/time");
const { BotConsole } = require("../log/botConsole");

const setting = require("../../setting/settings.json");
class Holiday {

    constructor() {
        this.Time = new Time()
        this.Cjson = new Cjson()
        this.hollydayjson = {}
        this.guiljson = {}
        this.nextHoliday = {}
        this.year = parseInt(this.Time.getCurrentYear())
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            await this.Cjson.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((json) => { this.guildJson = json }).catch((err) => { new BotConsole().log("Errore nell'inizializzare il json " + setting.configjson.online.name[2], "red"); return reject(-1) })
            await this.Cjson.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[3], process.env.GITTOKEN).then((json) => { this.holidayJson = json }).catch((err) => { new BotConsole().log("Errore nell'inizializzare il json " + setting.configjson.online.name[3], "red"); return reject(-1) })
            resolve(0);
        })

    }


    calculateNextHoliday() {

        return new Promise(async (resolve, reject) => {
            try {
                this.nextHoliday = this.hollydayjson.holidays.find(holy => {
                    return this.Time.getTimestampByInput(this.year, holy.date.mouth, holy.date.day) > this.Time.getCurrentTimestamp();
                });

                if (this.nextHoliday) {
                    resolve(0)
                } else {
                    this.year += 1;
                    resolve(await this.calculateNextHoliday())
                }
            } catch { reject(-1) }

        })

    }

    async updateChannel(channelCount, id) {
        try {
            if (this.Time.formatTimeDayscale(this.Time.getTimestampByInput(this.nextHoliday.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.Time.getCurrentTimestamp() > 0)) {
                let Time = `${this.Time.formatTimeDayscale(this.Time.getCurrentTimestamp(this.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.Time.getCurrentTimestamp())}`
                channelCount.setName(Time.toString()).catch(() => { new BotConsole().log("Non ho potuto aggiornare il conteggio della festa", "red") })
            } else {
                this.sendCongratulations(id)
            }

        } catch { new BotConsole().log("Non ho potuto aggiornare il conteggio della festa", "red") }

    }

    async sendCongratulations(id) {
        if (this.Time.formatTimeDayscale(this.Time.getTimestampByInput(this.nextHoliday.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.Time.getCurrentTimestamp()) <= 0) {
            clearInterval(id)
            this.main()
        }
    }

    async Timer(channelcount) {
        const id = setInterval(() => {
            this.updateChannel(channelcount, id)
        }, 5000 * 60)


    }

    main() {
        try {
            const guild = client.guilds.cache.find(x => x.id == this.guiljson["Anto's  Server"].id)
            const channelcount = guild.channels.cache.find(x => x.id == this.guiljson["Anto's  Server"].channel.hollyday.count)
            const channelname = guild.channels.cache.find(x => x.id == this.guiljson["Anto's  Server"].channel.hollyday.name)
            this.calculateNextHoliday().then(() => {
                if (!guild || !channelname || !channelcount || !this.nextHoliday) return
                new BotConsole().log("Nuova festa trovata:" + this.nextHoliday.name + " in data:" + this.nextHoliday.date.day + "/" + (this.nextHoliday.date.mouth + 1) + "/" + this.year)
                channelname.setName(this.nextHoliday.name).catch(() => { new BotConsole().log("Non ho potuto aggiornare il nome della festa", "red") })
                this.updateChannel(channelcount, null)
                this.Timer(channelcount)
            }).catch(() => { })

        } catch (err) { new BotConsole().log(err, "red") }
    }
}


module.exports = { Holiday }