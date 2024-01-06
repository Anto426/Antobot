const { baseembed } = require("../baseembed");

class comandbembed extends baseembed {
    constructor(guild, member) {
        super(guild, member)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.green); resolve(0) }).catch(() => { reject(-1) })
        })
    }

    ping(Latenza, ram, time) {
        return this.embed
            .setTitle("Pong 🏓")
            .setDescription("Questo comando restituisce le statistiche del bot")
            .addFields(
                {
                    name: "📶 Latenza",
                    value: Latenza,
                    inline: false
                },
                {
                    name: "💻 Ram",
                    value: ram,
                    inline: false
                },
                {
                    name: "⏲️ Tempo di accensione",
                    value: time,
                    inline: false
                },
            )
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }));
    }

}

module.exports = { comandbembed }