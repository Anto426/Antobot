const { EventEmbed } = require("../../../embed/base/events");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json")

module.exports = {
    name: "testembed",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: true,
    position: false,
    test: false,
    see: false,
    data: {
        name: "testembed",
        description: "Testa gli embed"
    },
    async execute(interaction) {
        try {
            let json = new Cjson();
            let [bots, humans] = (await interaction.guild.members.fetch()).partition(member => member.user.bot);
            json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((jsonf0) => {
                let embedmsg = new EventEmbed(interaction.guild)
                embedmsg.init().then(async () => {
                    let send = await embedmsg.welcome(interaction.member, humans.size).catch(() => { })
                    interaction.guild.channels.cache.find(x => x.id == jsonf0["Anto's  Server"].channel.info.welcome).send({ embeds: [send[0]], files: [send[1]] })

                }).catch((err) => { })

            })


        } catch (err) {
            console.log(err)
        }

    }
}