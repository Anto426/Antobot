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

    play(song) {
        return this.embed
            .setTitle("🎵 Tracia Aggiunta alla coda")
            .addFields(
                { name: '🎶 Name', value: song.name.toString(), inline: true },
                { name: '🔗 URL Song', value: `[Clicca qui](${song.url.toString()})`, inline: true },
                { name: '⌚ Duration', value: song.formattedDuration.toString(), inline: true },
                { name: '👁️ Views', value: song.views.toString(), inline: true },
                { name: '🧑‍🎨 Artist', value: song.uploader.name.toString(), inline: true },
                { name: '🔗 URL Artist', value: `[Clicca qui](${song.uploader.url.toString()})`, inline: true }
            )
            .setThumbnail(song.thumbnail)
    }

    repeat(mode) {
        return this.embed
            .setTitle("🔁 Ripetizione")
            .setDescription("Il modo di ripetizione è stato cambiato con successo!")
            .addFields([{ name: "Stato", value: (mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : "off"), inline: true }])
            .setThumbnail(embedconfig.image.repeat)
    }

    skip() {
        return this.embed
            .setTitle("⏭️ Skip")
            .setDescription("La canzone è stata saltata con successo!")
            .setThumbnail(embedconfig.image.skip)
    }

    stop() {
        return this.embed
            .setTitle("⏹️ Stop")
            .setDescription("La coda e stata pulita con successo!")
            .setThumbnail(embedconfig.image.stop)
    }

    volume(volume) {
        return this.embed
            .setTitle("🔊 Volume")
            .setDescription(`Il volume è stato impostato a ${volume}`)
            .setThumbnail(embedconfig.image.volume)
    }

    pause() {
        return this.embed
            .setTitle("⏸️ Pausa")
            .setDescription("La canzone è stata messa in pausa con successo!")
            .setThumbnail(embedconfig.image.pause)
    }

    resume() {
        return this.embed
            .setTitle("▶️ Riprendi")
            .setDescription("La canzone è stata ripresa con successo!")
            .setThumbnail(embedconfig.image.resume)
    }


}

module.exports = { CommandEmbed };