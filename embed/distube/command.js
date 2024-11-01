const { BaseEmbed } = require("../baseembed");

class CommandEmbed extends BaseEmbed {
    constructor(guild, member, image) {
        super(guild, member, image)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; resolve(0); }).catch(() => { reject(-1); });
        });
    }

    play(song) {
        return this.embed
            .setTitle("🎵 Traccia Aggiunta alla coda")
            .addFields(
                { name: '🎶 Name', value: `[${song.name}](${song.url})`, inline: false },
                { name: '⌚ Duration', value: song.formattedDuration, inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '💖 Like', value: song.likes.toString(), inline: true },
                { name: '🧑‍🎨 Artist', value: `[${song.uploader.name}](${song.uploader.url})`, inline: false },
            )
            .setThumbnail(song.thumbnail)
    }

    repeat(mode) {
        const modeDescriptions = {
            0: "⏹️ Off",
            1: "🔂 Ripeti canzone",
            2: "🔁 Ripeti coda"
        };
        const modeDescription = modeDescriptions[mode] || "⏹️ Off";

        return this.embed
            .setTitle("🔁 **Ripetizione**")
            .setDescription("Il modo di ripetizione è stato cambiato con successo!")
            .addFields(
                { name: "🔄 **Stato**", value: modeDescription, inline: true },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/repeat` per cambiare il modo di ripetizione.", inline: true }
            )
            .setThumbnail(embedconfig.image.repeat);
    }

    skip(oldSong, newSong) {
        return this.embed
            .setTitle("⏭️ **Salta**")
            .setDescription(`La canzone **${oldSong.name}** è stata saltata con successo! Ora in riproduzione: **${newSong.name}**`)
            .addFields(
                { name: "⏭️ **Canzone Precedente**", value: oldSong.name.toString(), inline: true },
                { name: "▶️ **Canzone Attuale**", value: newSong.name.toString(), inline: true }
            )
            .setThumbnail(newSong.thumbnail || embedconfig.image.skip)
    }

    stop(queen) {
        return this.embed
            .setTitle("⏹️ **Stop**")
            .setDescription("La coda è stata pulita con successo!")
            .addFields(
                { name: "🛑 **Stato**", value: "Stop", inline: true },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/play` per aggiungere nuove tracce alla coda.", inline: false }

            )
            .setThumbnail(embedconfig.image.stop)
    }

    volume(volume) {
        const volumeBar = Array.from({ length: 10 }, (_, i) => i < volume / 10 ? '█' : '░').join('');
        const coloredVolumeBar = volumeBar.split('').map((char, index) => {
            const color = index < volume / 10 ? '🟩' : '⬜';
            return color;
        }).join('');

        return this.embed
            .setTitle("🔊 **Volume Aggiornato**")
            .setDescription(`🎶 Il volume è stato impostato con successo!`)
            .addFields(
                { name: "🔊 **Livello Volume**", value: `${volume}%`, inline: true },
                { name: "📊 **Barra Volume**", value: coloredVolumeBar, inline: true }
            )
    }

    pause(song) {
        return this.embed
            .setTitle("⏸️ **Pausa**")
            .setDescription(`La canzone **${song.name}** è stata messa in pausa con successo!`)
            .addFields(
                { name: "⏸️ **Stato**", value: "In pausa", inline: true },
                { name: '🎶 Name', value: `[${song.name}](${song.url})`, inline: false },
                { name: '⌚ Duration', value: song.formattedDuration, inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '💖 Like', value: song.likes.toString(), inline: true },
                { name: '🧑‍🎨 Artist', value: `[${song.uploader.name}](${song.uploader.url})`, inline: false },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/resume` per riprendere la riproduzione.", inline: true }
            )
            .setThumbnail(song.thumbnail || embedconfig.image.pause)
    }


    resume(song) {
        return this.embed
            .setTitle("▶️ **Riprendi**")
            .setDescription(`La canzone **${song.name}** è stata ripresa con successo!`)
            .addFields(
                { name: "▶️ **Stato**", value: "In riproduzione", inline: false },
                { name: '🎶 Name', value: `[${song.name}](${song.url})`, inline: false },
                { name: '⌚ Duration', value: song.formattedDuration, inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '💖 Like', value: song.likes.toString(), inline: true },
                { name: '🧑‍🎨 Artist', value: `[${song.uploader.name}](${song.uploader.url})`, inline: false },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/pause` per mettere in pausa la riproduzione.", inline: false },
            )
            .setThumbnail(song.thumbnail || embedconfig.image.resume);
    }


}

module.exports = { CommandEmbed };