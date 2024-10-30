
const { Cjson } = require("../../../../function/file/json");
const { BotConsole } = require("../../../../function/log/botConsole");
const { Security } = require("../../../../function/security/security");

const setting = require("../../../../setting/settings.json");
const { ErrorManager, errorIndex } = require("../../../../function/err/errormenager");


module.exports = {
    name: "security",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        let errorManager = new ErrorManager(interaction.guild, interaction.member)
        if (!interaction.isChatInputCommand()) return;
        const command = client.commandg.get(interaction.commandName)
        let json = new Cjson();
        let security = new Security(interaction, command)
        let promises = []
        let jsonow = await json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[0], process.env.GITTOKEN).catch(() => { })
        let jsonow0 = await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig).catch(() => { })

        promises.push(security.checkOwner(jsonow.owner))
        promises.push(security.checkIsYou())
        promises.push(security.checkIsBot())
        promises.push(security.checkServerOwner())
        promises.push(security.checkPermission())
        promises.push(security.checkPosition())
        if (jsonow0 && jsonow0[interaction.guild.id])
            promises.push(security.checkChannel(jsonow0[interaction.guild.id].channel.allowchannel))
        else
            promises.push(security.checkChannel([]))


        Promise.all(promises).then(() => {
            security.allowCommand()
                .then(async (result) => {
                    try {
                        if (Array.isArray(result)) {
                            command.execute(interaction, result).catch((err) => {
                                interaction.reply({ embeds: [errorManager.getError(err)], ephemeral: true }).catch((err) => {
                                    console.error(err);
                                })
                            })
                        } else {
                            command.execute(interaction).catch(async (err) => {
                                interaction.reply({ embeds: [await errorManager.getError(err)], ephemeral: true }).catch((err) => {
                                    console.error(err);
                                })
                            })
                        }

                    } catch (err) {
                        interaction.reply({ embeds: [await errorManager.getError(errorIndex.GENERIC_ERROR)], ephemeral: true }).catch((err) => {
                            console.error(err);
                        })
                        new BotConsole().log("Errore durante esecuzione del comando", "red")
                        console.log(err)
                    }
                })
                .catch(async (err) => {
                    interaction.reply({ embeds: [await errorManager.getError(err)], ephemeral: true }).catch((err) => {
                        console.error(err);
                    })
                })
        })




    }

}