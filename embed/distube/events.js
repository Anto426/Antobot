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

    trackStart(queen, song, colorqueue) {
        return this.embed
            .setTitle("🎵 Traccia in riproduzione")
            .setDescription(`${song.name} è in riproduzione ora!`)
            .addFields(
                { name: '🔗 URL Song', value: `[Clicca qui](${song.url})`, inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '💖 Like', value: song.likes.toString(), inline: true },
                { name: '⌚ Duration', value: song.formattedDuration, inline: true },
                { name: "🔊 Volume", value: queen.volume.toString(), inline: true },
                { name: "💫 Autoplay", value: queen.autoplay ? "🟢 Attivato" : "🔴 Disattivato", inline: true },
                { name: '🧑‍🎨 Artist', value: `[${song.uploader.name}](${song.uploader.url})`, inline: false },
            )
            .setThumbnail(song.thumbnail)
            .setColor(colorqueue);
    }

    error(song) {
        return this.embed
            .setTitle("❌ Errore")
            .setDescription("Si è verificato un errore durante la riproduzione della canzone!")
            .addFields(
                { name: '🎶 Name', value: `[${song.name}](${song.url})`, inline: false },
                { name: '🔗 URL Song', value: `[Clicca qui](${song.url})`, inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '💖 Like', value: song.likes.toString(), inline: true },
                { name: '⌚ Duration', value: song.formattedDuration, inline: true },
                { name: "🔊 Volume", value: queen.volume.toString(), inline: true },
                { name: "💫 Autoplay", value: queen.autoplay ? "🟢 Attivato" : "🔴 Disattivato", inline: true },
                { name: '🧑‍🎨 Artist', value: `[${song.uploader.name}](${song.uploader.url})`, inline: false },
            )
            .setThumbnail(embedconfig.image.error);
    }
}

module.exports = { EventEmbed };