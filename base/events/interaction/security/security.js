
const { ErrEmbed } = require("../../../../embed/err/errembed");
const { Cjson } = require("../../../../function/file/json");
const { BotConsole } = require("../../../../function/log/botConsole");
const { Security } = require("../../../../function/security/security");

const setting = require("../../../../setting/settings.json")


module.exports = {
    name: "security",
    typeEvent: "interactionCreate",
    async execute(interaction) {
        let erremb = new ErrEmbed(interaction.guild, interaction.member)
        erremb.init()
        let embedf = [erremb.notPermissionError, erremb.botUserError, erremb.selfUserError, erremb.highPermissionError, erremb.notInVoiceChannelError, erremb.musicAlreadyPlayingError]
        if (!interaction.isChatInputCommand()) return;
        const command = client.commandg.get(interaction.commandName)
        let json = new Cjson();
        let security = new Security(interaction, command)

        let jsonow = {}
        let jsonow0 = {}
        let promises = []
        await json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[0], process.env.GITTOKEN).then((jsonowner) => { jsonow = jsonowner }).catch(() => { })
        await json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonguild) => { jsonow0 = jsonguild }).catch(() => { })

        promises.push(security.checkOwner(jsonow.owner))
        promises.push(security.checkIsYou())
        promises.push(security.checkIsBot())
        promises.push(security.checkServerOwner())
        promises.push(security.checkPermission())
        promises.push(security.checkPosition())
        promises.push(security.checkChannel(jsonow0["Anto's  Server"].channel.allowchannel))


        Promise.all(promises).then(() => {
            security.allowCommand()
                .then((result) => {
                    try {
                        if (Array.isArray(result)) {
                            command.execute(interaction, result)
                        } else {
                            command.execute(interaction)
                        }

                    } catch (err) {
                        interaction.reply({ embeds: [erremb.errGeneric()], ephemeral: true })
                        new BotConsole().log("Errore durante esecuzione del comando", "red")
                    }
                })
                .catch((err) => {
                    interaction.reply({ embeds: [embedf[err].call(erremb)], ephemeral: true })
                })
        })




    }

}