
const { Cjson } = require("../json/json");
const { time } = require("../time/time");
const dirpatch = require("../../setting/settings.json");
const { consolelog } = require("../log/consolelog");
class hollyday {

    constructor() {
        this.time = new time()
        this.Cjson = new Cjson()
        this.hollydayjson = {}
        this.guiljson = {}
        this.nextHoliday = {}
        this.year = this.time.getcorrentYear()
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            await this.Cjson.jsonddypendencebufferolyf(dirpatch.configjson.online.url + "/" + dirpatch.configjson.online.name[2], client.gitToken).then((json) => { this.guiljson = json }).catch((err) => { consolelog("Errore nel inizializare il json " + dirpatch.configjson.online.name[2]); return reject(-1) })
            await this.Cjson.jsonddypendencebufferolyf(dirpatch.configjson.online.url + "/" + dirpatch.configjson.online.name[3], client.gitToken).then((json) => { this.hollydayjson = json }).catch((err) => { consolelog("Errore nel inizializare il json " + dirpatch.configjson.online.name[3]); return reject(-1) })
            resolve(0);
        })

    }


    calculatenexthollyday() {
        this.nextHoliday = this.hollydayjson.holidays.find(holy => {
            return this.time.getTimestampbyinput(this.year, holy.date.mouth, holy.date.day) < this.time.getCurrentTimestamp();
        });

        if (this.nextHoliday) {
            return
        } else {
            this.year += 1;
            return this.calculatenexthollyday();
        }
    }

    async updatechannel(channelcount) {

        let time = `${this.time.formatttimedayscale(this.time.getTimestampbyinput(this.nextHoliday.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.time.getCurrentTimestamp())}`
        console.log(`Update : ${time}`)
        channelcount.setName(time.toString()).catch((err) => { console.log(err.toString()) })
    }

    async sendcongratulations(id1, id2) {
        if (this.time.formatttimedayscale(this.time.getTimestampbyinput(this.nextHoliday.year, this.nextHoliday.date.mouth, this.nextHoliday.date.day) - this.time.getCurrentTimestamp()) <= 0) {
            console.log(this.nextHoliday)
            this.main()
        }
    }


    main() {
        try {
            const guild = client.guilds.cache.find(x => x.id == this.guiljson["Anto's  Server"].id)
            const channelcount = guild.channels.cache.find(x => x.id == this.guiljson["Anto's  Server"].channel.hollyday.count)
            calculatenexthollyday(channelcount)
            consolelog(this.nextHoliday)



        } catch { }
    }
}


module.exports = { hollyday }