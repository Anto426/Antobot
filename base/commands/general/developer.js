const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json")
const package = require("../../../package.json")
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

        let embed = new comandbembed(interaction.guild, interaction.member)
        let json = new Cjson()

        embed.init().then(() => {
            json.jsonDependencyBuffer(`${setting.configjson.online.url2}${package.author}`, process.env.GITTOKEN).then((data) => {
                interaction.reply({
                    embeds: [embed.githubcreator(data)]
                });
            }).catch(() => {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }
                ).catch((err) => {
                    console.error(err);
                })
            })

        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
            }
            ).catch((err) => {
                console.error(err);
            })
        })
    }
}