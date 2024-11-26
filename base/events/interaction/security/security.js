
const { Cjson } = require("../../../../function/file/json");
const { Security } = require("../../../../function/security/security");
const setting = require("../../../../setting/settings.json");


module.exports = {
    name: "security",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {

        return new Promise(async (resolve, reject) => {
            if (!interaction.isChatInputCommand()) return;

            const command = client.commandg.get(interaction.commandName);

            if (command) {

                let json = new Cjson();
                let jsonow = await json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[0], process.env.GITTOKEN).catch((err) => { return console.log(err) })
                let jsonow0 = await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch((err) => { return console.log(err) })
                let security = new Security(interaction, command, jsonow.owner, jsonow0?.[interaction.guild.id]?.command?.[command.name] || [])

                security.allowCommand()
                    .then(async (result) => {
                        command.execute(interaction, result).catch((err) => { reject([interaction, err]) })
                        resolve(0)
                    })
                    .catch(async (err) => {
                        reject([interaction, err])
                    })

            } else {
                reject([interaction, errorIndex.REPLY_ERRORS.GENERIC_ERROR])
            }
        })
    }

}