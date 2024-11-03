
const { Cjson } = require("../../../../function/file/json");
const { Security } = require("../../../../function/security/security");

const setting = require("../../../../setting/settings.json");
const { ErrorManager, errorIndex } = require("../../../../function/err/errormenager");


module.exports = {
    name: "security",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const errorManager = new ErrorManager(interaction.guild, interaction.member);
        const error = errorManager.replyError.bind(errorManager);
        const command = client.commandg.get(interaction.commandName);

        if (command) {

            let json = new Cjson();
            let jsonow = await json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[0], process.env.GITTOKEN).catch((err) => { return console.log(err) })
            let jsonow0 = await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch((err) => { return console.log(err) })
            let security = new Security(interaction, command, jsonow.owner, jsonow0?.[interaction.guild.id]?.command?.[command.name] || {})

            security.allowCommand()
                .then(async (result) => {
                    command.execute(interaction, result).catch((err) => { error(interaction, err) })
                })
                .catch(async (err) => {
                    console.log(err)
                    error(interaction, err)
                })

        } else {
            error(interaction, errorIndex.COMMAND_NOT_FOUND_ERROR)
        }
    }

}