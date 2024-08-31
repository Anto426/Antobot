const { BaseEmbed } = require("../baseembed");

class EventEmbed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member);
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.purple); resolve(0); }).catch(() => { reject(-1); });
        });
    }

    trackStart(queen, song) {
        return this.embed
            .setTitle("🎵 Traccia in riproduzione")
            .setDescription(song.name.toString() + " è in riproduzione ora!")
            .addFields(
                { name: "⌚ Durata", value: song.formattedDuration.toString(), inline: true },
                { name: "🔊 Volume", value: queen.volume.toString(), inline: true },
                { name: "💫 Autorepeat", value: queen.autoplay ? "🟢 Attivato" : "🔴 Disattivato", inline: true }
            )
            .setThumbnail(song.thumbnail)

    }

}

module.exports = { EventEmbed };