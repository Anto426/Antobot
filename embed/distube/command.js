const { BaseEmbed } = require("../baseembed");

class CommandEmbed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member);
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.purple); resolve(0); }).catch(() => { reject(-1); });
        });
    }

    play(song, songcolor) {
        return this.embed
            .setTitle("🎵 Traccia Aggiunta alla coda")
            .addFields(
                { name: '🎶 Nome', value: song.name.toString(), inline: true },
                { name: '🔗 URL Canzone', value: `[Clicca qui](${song.url.toString()})`, inline: true },
                { name: '⌚ Durata', value: song.formattedDuration.toString(), inline: true },
                { name: '👁️ Visualizzazioni', value: song.views.toString(), inline: true },
                { name: '🧑‍🎨 Artista', value: song.uploader.name.toString(), inline: true },
                { name: '🔗 URL Artista', value: `[Clicca qui](${song.uploader.url.toString()})`, inline: true }
            )
            .setThumbnail(song.thumbnail)
            .setColor(songcolor);
    }

    repeat(mode) {
        return this.embed
            .setTitle("🔁 Ripetizione")
            .setDescription("Il modo di ripetizione è stato cambiato con successo!")
            .addFields(
                { name: "Stato", value: mode ? (mode === 2 ? 'Ripeti coda' : 'Ripeti canzone') : "Off", inline: true }
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
            .setColor(embedconfig.color.blue);
    }

    stop() {
        return this.embed
            .setTitle("⏹️ **Stop**")
            .setDescription("La coda è stata pulita con successo!")
            .addFields(
                { name: "🛑 **Stato**", value: "Fermato", inline: true },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/play` per aggiungere nuove tracce alla coda.", inline: true }
            )
            .setThumbnail(embedconfig.image.stop)
            .setColor(embedconfig.color.red);
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
            .setThumbnail(embedconfig.image.volume);
    }

    pause(song) {
        return this.embed
            .setTitle("⏸️ **Pausa**")
            .setDescription(`La canzone **${song.title}** è stata messa in pausa con successo!`)
            .addFields(
                { name: "⏸️ **Stato**", value: "In pausa", inline: true },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/resume` per riprendere la riproduzione.", inline: true } // Suggerimento utile
            )
            .setThumbnail(song.thumbnail || embedconfig.image.pause)
            .setColor(embedconfig.color.yellow);
    }


    resume(song) {
        return this.embed
            .setTitle("▶️ **Riprendi**")
            .setDescription(`La canzone **${song.title}** è stata ripresa con successo!`)
            .addFields(
                { name: "▶️ **Stato**", value: "In riproduzione", inline: true },
                { name: "💡 **Suggerimento**", value: "Usa il comando `/pause` per mettere in pausa la riproduzione.", inline: true } // Suggerimento utile
            )
            .setThumbnail(song.thumbnail || embedconfig.image.resume)
            .setColor(embedconfig.color.green);
    }


}

module.exports = { CommandEmbed };