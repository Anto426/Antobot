const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");
const setting = require("../../../setting/settings.json");


module.exports = {
    name: "ClearChat",
    typeEvent: "messageCreate",
    allowevents: true,
    async execute(message) {

        let json = new Cjson();

        json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).then((jsonf) => {
            jsonf[message.guild].channel.allowchannel.forEach(x => {
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