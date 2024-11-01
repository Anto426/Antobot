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
            .setTitle("🛠️ Oops! Qualcosa è andato storto... 🤖💥")
            .setDescription("⚠️ Si è verificato un errore durante l'esecuzione del comando. Per favore, riprova più tardi o contatta un amministratore.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notPermissionError() {
        return this.embed
            .setTitle("🚫 Permesso Negato 🚫")
            .setDescription("⚠️ Non hai i permessi necessari per eseguire questa azione. Contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    ChannelError() {
        return this.embed
            .setTitle("🚫 Canale Non Valido 🚫")
            .setDescription("⚠️ Questo comando non può essere eseguito in questo canale. Contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    wrongButtonError() {
        return this.embed
            .setTitle("⚠️ Bottone Sbagliato ⚠️")
            .setDescription("⚔️ Questo bottone non è associato al tuo ID utente, quindi non puoi utilizzarlo.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    highPermissionError() {
        return this.embed
            .setTitle("⚠️ Permessi Troppo Elevati ⚠️")
            .setDescription("⚡ La persona a cui stai cercando di applicare questa azione ha un ruolo superiore al tuo.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    BotnotPermissionError() {
        return this.embed
            .setTitle("🚫 Permesso Negato 🚫")
            .setDescription("⚠️ Non ho i permessi necessari per eseguire questa azione. Prova a spostare il ruolo di " + client.user.tag + " più in alto nelle impostazioni del server.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    botUserError() {
        return this.embed
            .setTitle("🤖 L'utente è un Bot 🤖")
            .setDescription("⚠️ Non posso eseguire questa azione su un bot.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    selfUserError() {
        return this.embed
            .setTitle("⚠️ Azione su Te Stesso ⚠️")
            .setDescription("🪃 Non puoi eseguire questa azione su te stesso.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    ChannelnotFoundError() {
        return this.embed
            .setTitle("🚫 Canale Non Trovato 🚫")
            .setDescription("⚠️ Non riesco a trovare il canale specificato. Contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    notInVoiceChannelError() {
        return this.embed
            .setTitle("🎵 Non Sei in una Chat Vocale 🎵")
            .setDescription("⚠️ Devi essere in una chat vocale per eseguire questo comando.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    musicAlreadyPlayingError() {
        return this.embed
            .setTitle("🎵 Musica Già in Riproduzione 🎵")
            .setDescription("⚠️ Sto già riproducendo un brano per qualcun altro.")
            .setThumbnail(embedconfig.image.notpermission)
    }

    nottrackfoundError() {
        return this.embed
            .setTitle("🎵 Traccia Non Trovata 🎵")
            .setDescription("⚠️ Non riesco a trovare nessuna traccia con quel nome.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    listtrackError() {
        return this.embed
            .setTitle("🎵 Lista Vuota 🎵")
            .setDescription("⚠️ La lista delle tracce è vuota.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notrakskipableError() {
        return this.embed
            .setTitle("🎶 Nessuna Traccia da Saltare 🎶")
            .setDescription("⚠️ Non ci sono ulteriori tracce da saltare.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    playlistError() {
        return this.embed
            .setTitle("🎶 Playlist Non Supportata 🎶")
            .setDescription("⚠️ Non posso riprodurre playlist.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notpauseError() {
        return this.embed
            .setTitle("🎶 Impossibile Mettere in Pausa 🎶")
            .setDescription("⚠️ Non posso mettere in pausa la riproduzione.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    playError() {
        return this.embed
            .setTitle("🎶 Impossibile Riprodurre 🎶")
            .setDescription("⚠️ Non posso riprodurre la traccia.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notvolumeError() {
        return this.embed
            .setTitle("🔊 Impossibile Impostare il Volume 🔊")
            .setDescription("⚠️ Non posso impostare il volume.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notrepeatError() {
        return this.embed
            .setTitle("🔁 Impossibile Impostare la Ripetizione 🔁")
            .setDescription("⚠️ Non posso impostare la ripetizione.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notstopError() {
        return this.embed
            .setTitle("⏹️ Impossibile Fermare la Riproduzione ⏹️")
            .setDescription("⚠️ Non posso fermare la riproduzione.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notskipError() {
        return this.embed
            .setTitle("⏭️ Impossibile Saltare la Traccia ⏭️")
            .setDescription("⚠️ Non posso saltare la traccia.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notresumeError() {
        return this.embed
            .setTitle("▶️ Impossibile Riprendere la Riproduzione ▶️")
            .setDescription("⚠️ Non posso riprendere la riproduzione.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notbanError() {
        return this.embed
            .setTitle("🚫 Impossibile Bannare l'Utente 🚫")
            .setDescription("⚠️ Non posso bannare l'utente.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notkickError() {
        return this.embed
            .setTitle("🚫 Impossibile Espellere l'Utente 🚫")
            .setDescription("⚠️ Non posso espellere l'utente.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    nottimeoutError() {
        return this.embed
            .setTitle("🚫 Impossibile Timeoutare l'Utente 🚫")
            .setDescription("⚠️ Non posso mettere in timeout l'utente.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    isjusttimeoutError() {
        return this.embed
            .setTitle("🚫 Utente Già in Timeout 🚫")
            .setDescription("⚠️ L'utente è già in timeout.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notuntimeoutError() {
        return this.embed
            .setTitle("🚫 Impossibile Rimuovere il Timeout 🚫")
            .setDescription("⚠️ Non posso rimuovere il timeout.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    nothavetimeoutError() {
        return this.embed
            .setTitle("🚫 Utente Non in Timeout 🚫")
            .setDescription("⚠️ L'utente non è in timeout.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notlistbanerror() {
        return this.embed
            .setTitle("🚫 Impossibile Ottenere la Lista dei Ban 🚫")
            .setDescription("⚠️ Non posso ottenere la lista dei ban.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notUserfoundError() {
        return this.embed
            .setTitle("🚫 Utente Non Trovato 🚫")
            .setDescription("⚠️ Non riesco a trovare l'utente specificato.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    notunbannedError() {
        return this.embed
            .setTitle("🚫 Impossibile Sbanare l'Utente 🚫")
            .setDescription("⚠️ Non posso sbanare l'utente.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    evaleError() {
        return this.embed
            .setTitle("🚫 Comando Non Eseguito 🚫")
            .setDescription("⚠️ Non posso eseguire il comando.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    ownerError() {
        return this.embed
            .setTitle("🚫 Errore: Solo per Owner 🚫")
            .setDescription("⚠️ Questo comando può essere eseguito solo dall'owner.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    bulkdeleteError() {
        return this.embed
            .setTitle("🚫 Impossibile Cancellare i Messaggi 🚫")
            .setDescription("⚠️ Non posso cancellare i messaggi.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    buttonnotvalidError() {
        return this.embed
            .setTitle("🚫 Bottone Non Valido 🚫")
            .setDescription("⚠️ Questo bottone non è più valido. Prova a rieseguire il comando. Se il problema persiste, contatta un amministratore.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    CommandNotFountError() {
        return this.embed
            .setTitle("🚫 Comando Non Trovato 🚫")
            .setDescription("⚠️ Questo comando non esiste.")
            .setThumbnail(embedconfig.image.genericerr)
    }

    membernotfoundError() {
        return this.embed
            .setTitle("🚫 Membro Non Trovato 🚫")
            .setDescription("⚠️ Non riesco a trovare il membro specificato.")
            .setThumbnail(embedconfig.image.genericerr)
    }


}



module.exports = {
    ErrEmbed
}