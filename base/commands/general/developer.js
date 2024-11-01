const { comandbembed } = require("../../../embed/base/command");
const { errorIndex } = require("../../../function/err/errormenager");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json")
const package = require("../../../package.json");
module.exports = {
    name: "developer",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "developer",
        description: "info sul creatore del bot"
    },
    execute(interaction) {

        return new Promise((resolve, reject) => {

            let json = new Cjson()

            json.jsonDependencyBuffer(`${setting.configjson.online.url2}${package.author}`, process.env.GITTOKEN).then(async (data) => {
                let embed = new comandbembed(interaction.guild, interaction.member, data.avatar_url)
                embed.init().then(() => {
                    interaction.reply({
                        embeds: [embed.githubcreator(data)]
                    }).catch((err) => { console.log(err) });
                    resolve(0)
                }).catch((err) => {
                    console.log(err)
                    reject(errorIndex.GENERIC_ERROR)
                })
            }).catch((err) => {
                console.log(err)
                reject(errorIndex.GENERIC_ERROR)
            })
        });
    }

}