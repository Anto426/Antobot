const { BaseEmbed } = require("../baseembed");

class ErrEmbed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member)
    }
    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.red); resolve(0) }).catch(() => { reject(-1) })
        })
    }

    genericError() {
        return this.embed
            .setTitle("🛠️ Ops! Qualcosa è andato storto... 🤖💥")
            .setDescription("⚠️ Spiacenti, si è verificato un problema durante uso del comando, se il problema persiste contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.genericerr)

    }
    notPermissionError() {
        return this.embed
            .setTitle("⚠️ Errore: Permesso negato ⚠️")
            .setDescription("🚫 Spiacenti, non hai i permessi necessari per eseguire questa azione. Contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.notpermission)

    }


    wrongButtonError() {
        return this.embed
            .setTitle("⚠️ Ops! Non è il tuo bottone questo ⚠️")
            .setDescription("⚔️Questo bottone non corrispone al tuo id utente, pertanto non potrai usarlo")
            .setThumbnail(embedconfig.image.notpermission)

    }

    highPermissionError() {
        return this.embed
            .setTitle("⚠️ Permessi troppo elevati ⚠️")
            .setDescription("⚡La persona a cui stati cercando di applicare la seguente azione dispone di un ruolo più alto del tuo.")
            .setThumbnail(embedconfig.image.notpermission)

    }
    botUserError() {
        return this.embed
            .setTitle("⚠️ L'utente è un bot ⚠️")
            .setDescription("🤖La persona a cui stati cercando di applicare la seguente azione è un bot pertanto non posso fare nulla.")
            .setThumbnail(embedconfig.image.notpermission)
    }
    selfUserError() {
        return this.embed
            .setTitle("⚠️  L'utente sei tu ⚠️")
            .setDescription("🪃La persona a cui stati cercando di applicare la seguente azione sei tu quindi non posso fare nulla.")
            .setThumbnail(embedconfig.image.notpermission)
    }
    notInVoiceChannelError() {
        return this.embed
            .setTitle("🎵 Non ti trovi in una chat vocale 🎵")
            .setDescription("Non sei in una chat vocale")
            .setThumbnail(embedconfig.image.notpermission)
    }

    musicAlreadyPlayingError() {
        return this.embed
            .setTitle("🎵 Musica gia in riproduzione🎵")
            .setDescription("Sto gia riproducendo un brano per qualc'altro")
            .setThumbnail(embedconfig.image.notpermission)
    }

    nottrackfoundError() {
        return this.embed
            .setTitle("🎵 Traccia non trovata🎵")
            .setDescription("Non ho trovato nessuna traccia con quel nome")
            .setThumbnail(embedconfig.image.genericerr)
    }

    listtrackError() {
        return this.embed
            .setTitle("🎵 Lista vuota🎵")
            .setDescription("La lista è vuota")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notrakskipableError() {
        return this.embed
            .setTitle("🎶 Non sono presenti ulteriori tracce")
            .setDescription("Non posso saltare questa traccia")
            .setThumbnail(embedconfig.image.genericerr)
    }

    playlistError() {
        return this.embed
            .setTitle("🎶 Playlist non supportata")
            .setDescription("Non posso riprodurre playlist")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notpauseError() {
        return this.embed
            .setTitle("🎶 Non è stato possibile mettere in pausa")
            .setDescription("non posso mettere in pausa la riproduzione")
            .setThumbnail(embedconfig.image.genericerr)
    }

    playError() {
        return this.embed
            .setTitle("🎶 Non è stato possibile riprodurre")
            .setDescription("non posso riprodurre la traccia")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notvolumeError() {
        return this.embed
            .setTitle("🔊 Non è stato possibile impostare il volume")
            .setDescription("non posso impostare il volume")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notrepeatError() {
        return this.embed
            .setTitle("🔁 Non è stato possibile impostare la ripetizione")
            .setDescription("non posso impostare la ripetizione")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notstopError() {
        return this.embed
            .setTitle("⏹️ Non è stato possibile fermare la riproduzione")
            .setDescription("non posso fermare la riproduzione")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notskipError() {
        return this.embed
            .setTitle("⏭️ Non è stato possibile saltare la traccia")
            .setDescription("non posso saltare la traccia")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notresumeError() {
        return this.embed
            .setTitle("▶️ Non è stato possibile riprendere la riproduzione")
            .setDescription("non posso riprendere la riproduzione")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notbanError() {
        return this.embed
            .setTitle("🚫 Non è stato possibile bannare l'utente")
            .setDescription("non posso bannare l'utente")
            .setThumbnail(embedconfig.image.genericerr)
    }
    
}



module.exports = {
    ErrEmbed
}