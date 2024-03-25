const { errembed } = require("../../../../embed/err/errembed");
const { Cjson } = require("../../../../function/file/json");
const { consolelog } = require("../../../../function/log/consolelog");
const { securyty } = require("../../../../function/security/security");

const setting = require("../../../../setting/settings.json")
module.exports = {
    name: "security",
    typeEvent: "interactionCreate",
    async execute(interaction) {
        let erremb = new errembed(interaction.guild, interaction.member)
        erremb.init()
        let embedf = [erremb.errNotPermission, erremb.errAreBot, erremb.errAreYou, erremb.errTohigtPermission]
        if (!interaction.isChatInputCommand()) return;
        const command = client.basecommands.get(interaction.commandName)
        let json = new Cjson();
        let security = new securyty(interaction, command)

        let jsonow = {}
        let jsonow0 = {}
        let promises = []
        await json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[0], process.env.GITTOKEN).then((jsonowner) => { jsonow = jsonowner }).catch(() => { })
        await json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonguild) => { jsonow0 = jsonguild }).catch(() => { })

        promises.push(security.chekowner(jsonow.owner))
        promises.push(security.checkisyou())
        promises.push(security.chekisbot())
        promises.push(security.checksowner())
        promises.push(security.checkpermision())
        promises.push(security.checkposition())
        promises.push(security.checkpchannel(jsonow0["Anto's  Server"].channel.allowchannel))


        Promise.all(promises).then(() => {
            security.allowcomand()
                .then(() => {
                    try {
                        command.execute(interaction)
                    } catch (err) {
                        interaction.reply({ embeds: [erremb.errGeneric()], ephemeral: true })
                         
                        consolelog("Errore durante esecuzione del comando", "red")
                    }
                })
                .catch((err) => {
                    interaction.reply({ embeds: [embedf[err].call(erremb)], ephemeral: true })
                })
        })




    }

}