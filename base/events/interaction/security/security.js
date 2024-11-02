
const { Cjson } = require("../../../../function/file/json");
const { Security } = require("../../../../function/security/security");

const setting = require("../../../../setting/settings.json");
const { ErrorManager } = require("../../../../function/err/errormenager");


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
            let security = new Security(interaction, command)
            let promises = []
            let jsonow = await json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[0], process.env.GITTOKEN).catch((err) => { return console.log(err) })
            let jsonow0 = await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch((err) => { return console.log(err) })

            promises.push(security.checkOwner(jsonow.owner))
            promises.push(security.checkIsYou())
            promises.push(security.checkIsBot())
            promises.push(security.checkServerOwner())
            promises.push(security.checkPermission())
            promises.push(security.checkPosition())
            promises.push(security.checkChannel(jsonow0?.[interaction.guild.id]?.channel?.allowchannel || []));

            Promise.all(promises).then(() => {
                security.allowCommand()
                    .then(async (result) => {
                        try {
                            if (Array.isArray(result)) {
                                command.execute(interaction, result).catch((err) => {
                                    error(interaction, err)
                                })
                            } else {
                                command.execute(interaction).catch((err) => {
                                    error(interaction, err)
                                })
                            }
                        } catch (err) {
                            errorManager.replyError(err).catch((err) => {
                                error(interaction, err)
                            })
                        }
                    })
                    .catch(async (err) => {
                        error(interaction, err)
                    })
            })

        } else {
            error(interaction, err)
        }
    }

}