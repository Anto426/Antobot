
const { ErrEmbed } = require("../../../../embed/err/errembed");
const { Cjson } = require("../../../../function/file/json");
const { BotConsole } = require("../../../../function/log/botConsole");
const { Security } = require("../../../../function/security/security");

const setting = require("../../../../setting/settings.json")


module.exports = {
    name: "security",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        let erremb = new ErrEmbed(interaction.guild, interaction.member)
        erremb.init()
        let embedf = [
            erremb.genericError,
            erremb.ownerError,
            erremb.notPermissionError,
            erremb.botUserError,
            erremb.ChannelError,
            erremb.selfUserError,
            erremb.highPermissionError,
            erremb.notInVoiceChannelError,
            erremb.musicAlreadyPlayingError,
            erremb.listtrackError
        ]
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
                .then((result) => {
                    try {
                        if (Array.isArray(result)) {
                            command.execute(interaction, result)
                        } else {
                            command.execute(interaction)
                        }

                    } catch (err) {
                        interaction.reply({ embeds: [erremb.genericError()], ephemeral: true }).catch((err) => {
                            console.error(err);
                        })
                        new BotConsole().log("Errore durante esecuzione del comando", "red")
                        console.log(err)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    interaction.reply({ embeds: [embedf[err].call(erremb)], ephemeral: true }).catch((err) => {
                        console.error(err);
                    })
                })
        })




    }

}