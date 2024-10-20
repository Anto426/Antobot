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
                { name: '🎶 Name', value: song.name, inline: false },
                { name: '🔗 URL Song', value: `[Clicca qui](${song.url.toString()})`, inline: true },
                { name: '⌚ Duration', value: song.formattedDuration.toString(), inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: "🔊 Volume", value: queen.volume.toString(), inline: true },
                { name: "💫 autoplay", value: queen.autoplay ? "🟢 Attivato" : "🔴 Disattivato", inline: true },
                { name: '🧑‍🎨 Artist', value: song.uploader.name.toString(), inline: true },
                { name: '🔗 URL Artist', value: `[Clicca qui](${song.uploader.url})`, inline: true }
            )
            .setThumbnail(song.thumbnail)

    }

    error(song) {
        return this.embed
            .setTitle("❌ Errore")
            .setDescription("Si è verificato un errore durante la riproduzione della canzone!")
            .addFields(
                { name: '🎶 Name', value: song.name, inline: false },
                { name: '🔗 URL Song', value: `[Clicca qui](${song.url.toString()})`, inline: true },
                { name: '⌚ Duration', value: song.formattedDuration.toString(), inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '🧑‍🎨 Artist', value: song.uploader.name.toString(), inline: true },
                { name: '🔗 URL Artist', value: `[Clicca qui](${song.uploader.url})`, inline: true }
            )
            .setThumbnail(embedconfig.image.error)
    }




}

module.exports = { EventEmbed };