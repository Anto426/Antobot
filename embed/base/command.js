const { BaseEmbed } = require("../baseembed");

class comandbembed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.green); resolve(0) }).catch(() => { reject(-1) })
        })
    }

    ping(latency, ram, Time) {
        return this.embed
            .setTitle("Pong 🏓")
            .setDescription("Questo comando restituisce le statistiche del bot")
            .addFields(
                {
                    name: "📶 Latenza",
                    value: latency ? latency : "Sconosciuta",
                    inline: true
                },
                {
                    name: "💻 Ram",
                    value: ram ? ram : "Sconosciuta",
                    inline: true
                },
                {
                    name: "⏲️ Tempo di accensione",
                    value: Time ? Time : "Sconosciuto",
                    inline: false
                },
            )
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }));
    }

    help() {
        return this.embed
            .setTitle("🆘 Help")
            .setDescription("🌟 Benvenuto nel comando 'help'! Hai bisogno di informazioni su un particolare comando? Clicca su quello di cui hai bisogno e io ti aiuterò! 🚀")
            .setThumbnail(embedconfig.image.help)
    }

    eval() {
        return this.embed
            .setTitle("🤖 Eval")
    }



}

module.exports = { comandbembed }