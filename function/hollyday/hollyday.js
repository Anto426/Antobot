
const { Cjson } = require("../json/json");
const { time } = require("../time/time");
const setting = require("../../setting/settings.json");
const { consolelog } = require("../log/consolelog");
class hollyday {

    constructor() {
        this.time = new time()
        this.Cjson = new Cjson()
        this.hollydayjson = {}
        this.guiljson = {}
        this.nextHoliday = {}
        this.year = parseInt(this.time.getcorrentYear())
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            await this.Cjson.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[2], client.gitToken).then((json) => { this.guiljson = json }).catch((err) => { consolelog("Errore nel inizializare il json " + setting.configjson.online.name[2], "red"); return reject(-1) })
            await this.Cjson.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[3], client.gitToken).then((json) => { this.hollydayjson = json }).catch((err) => { consolelog("Errore nel inizializare il json " + setting.configjson.online.name[3], "red"); return reject(-1) })
            resolve(0);
        })

    }


    calculatenexthollyday() {

        return new Promise(async (resolve, reject) => {
            try {
                this.nextHoliday = this.hollydayjson.holidays.find(holy => {
                    return this.time.getTimestampbyinput(this.year, holy.date.mouth, holy.date.day) > this.time.getCurrentTimestamp();
                });

                if (this.nextHoliday) {
                    resolve(0)
                } else {
                    this.year += 1;
                    resolve(await this.calculatenexthollyday())
                }
            } catch { reject(-1) }

        })

    }

    async updatechannel(channelcount, id) {
        try {
            if (this.time.formatttimedayscale(this.time.getTimestampbyinput(this.nextHoliday.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.time.getCurrentTimestamp() > 0)) {
                let time = `${this.time.formatttimedayscale(this.time.getTimestampbyinput(this.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.time.getCurrentTimestamp())}`
                channelcount.setName(time.toString()).catch(() => { consolelog("Non ho potuto aggiornare il conteggio della festa", "red") })
            } else {
                sendcongratulations(id)
            }

        } catch { consolelog("Non ho potuto aggiornare il conteggio della festa", "red") }

    }

    async sendcongratulations(id) {
        if (this.time.formatttimedayscale(this.time.getTimestampbyinput(this.nextHoliday.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.time.getCurrentTimestamp()) <= 0) {
            clearInterval(id)
            this.main()
        }
    }

    async timer(channelcount) {
        const id = setInterval(() => {
            this.updatechannel(channelcount, id)
        }, 5000 * 60)


    }

    main() {
        try {
            const guild = client.guilds.cache.find(x => x.id == this.guiljson["Anto's  Server"].id)
            const channelcount = guild.channels.cache.find(x => x.id == this.guiljson["Anto's  Server"].channel.hollyday.count)
            const channelname = guild.channels.cache.find(x => x.id == this.guiljson["Anto's  Server"].channel.hollyday.name)
            this.calculatenexthollyday().then(() => {
                if (!guild || !channelname || !channelcount || !this.nextHoliday) return
                consolelog("Nuova festa trovata:" + this.nextHoliday.name + " in data:" + this.nextHoliday.date.day + 1 + "/" + this.nextHoliday.date.mouth + 1 + "/" + this.year)
                channelname.setName(this.nextHoliday.name).catch(() => { consolelog("Non ho potuto aggiornare il nome della festa", "red") })
                this.updatechannel(channelcount, null)
                this.timer(channelcount)
            }).catch(() => { })

        } catch (err) { consolelog(err, "red") }
    }
}


module.exports = { hollyday }