const { Cjson } = require("../../../../function/json/json");
const { consolelog } = require("../../../../function/log/consolelog");
const { securyty } = require("../../../../function/security/security");
const setting = require("../../../../setting/settings.json")
module.exports = {
    name: "security",
    typeEvent:"interactionCreate",
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        let json = new Cjson();
        let security = new securyty()

        const command = client.basecommands.get(interaction.commandName)
        let jsonow = {}

        await json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[0], client.gitToken).then((jsonowner) => { jsonow = jsonowner }).catch(() => { })
        security.chekowner(interaction.member.id, jsonow.owner)
        security.checksowner(interaction.member.id, interaction.guild.id)
        security.checkpermision(interaction, interaction.guild, command.permisions)
        security.checkposition(interaction.member.id, interaction.options.getMember("user") ? interaction.options.getMember("user").id : null, interaction.guild.id)
        security.checkpchannel(interaction.channel.id, command.allowedchannels)
        security.allowcomand(command.OnlyOwner, command.position, command.permisions.length, command.allowedchannels.length)
            .then(() => {
                command.execute(interaction)
            })
            .catch((err) => {
                consolelog(err, "red");
            })

        json = null;
        security = null


    }

}