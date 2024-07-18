const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");
const setting = require("../../../setting/settings.json");


module.exports = {
    name: "ClearChat",
    typeEvent: "messageCreate",
    async execute(message) {

        let json = new Cjson();

        json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf) => {
            jsonf['Anto\'s Server'].channel.allowchannel.forEach(x => {
                try {
                    if (message.channel.id == x && !message.author.bot) {
                        message.delete().catch(() => { });
                        return;
                    }
                } catch (err) { new BotConsole().log("Errore non sono riuscito a cancellare il messaggio", "red"); }

            });
        }).catch(() => { });


    }
};