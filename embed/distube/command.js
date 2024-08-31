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

    play() {
        return this.embed
            .setTitle("🎵 Tracia Aggiunta alla coda")
            .setDescription("La canzone è stata aggiunta alla coda con successo!")
            .setThumbnail(embedconfig.image.songadd)
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


}

module.exports = { CommandEmbed };