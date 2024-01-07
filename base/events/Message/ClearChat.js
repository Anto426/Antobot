const { Cjson } = require("../../../function/json/json")
const { consolelog } = require("../../../function/log/consolelog")
const setting = require("../../../setting/settings.json")
module.exports = {
    name: "ClearChat",
    typeEvent: "messageCreate",
    async execute(message) {

        let json = new Cjson()

        json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf) => {
            jsonf['Anto\'s  Server'].channel.allowchannel.forEach(x => {
                try {
                    if (message.channel.id == x && !message.author.bot) {
                        message.delete().catch(() => { })
                        return
                    }
                } catch (err) { consolelog("Errore non sono risucito a cancellare il messagio", "red") }

            })
        }).catch((err) => { })


    }
}