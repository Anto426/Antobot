const { Cjson } = require("../../../function/json/json");
const { consolelog } = require("../../../function/log/consolelog");
const { securyty } = require("../../../function/security/security");
const dirpatch = require("../../../setting/settings.json")
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        let json = new Cjson();
        let security = new securyty()

        const command = client.commands.get(interaction.commandName)
        let jsonow = {}

        await json.jsonddypendencebufferolyf(dirpatch.configjson.online.url + "/" + dirpatch.configjson.online.name[0], client.gitToken).then((jsonowner) => { jsonow = jsonowner}).catch(() => { })
        security.chekowner(interaction.member.id, jsonow.owner)
        security.checksowner(interaction.member.id,interaction.guild.id)
        security.checkpermision(interaction, command.permisions)
        security.checkposition(interaction.member.id, interaction.options.getMember("user") ? interaction.options.getMember("user").id : null, interaction.guild.id)
        security.checkpchannel(interaction.channel.id, command.allowedchannels)
        security.allowcomand(command.OnlyOwner, command.position, command.permisions.length, command.allowedchannels.length)
            .then(() => {
                command.execute(interaction)
            })
            .catch((err) => {
                consolelog(err);
            })

    }

}