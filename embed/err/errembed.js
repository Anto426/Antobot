const { baseembed } = require("../baseembed");

class errembed extends baseembed {
    constructor(guild, member) {
        super(guild, member)
    }
    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.red); resolve(0) }).catch(() => { reject(-1) })
        })
    }

    errGeneric() {
        return this.embed
            .setTitle("🛠️ Ops! Qualcosa è andato storto... 🤖💥")
            .setDescription("⚠️ Spiacenti, si è verificato un problema durante uso del comando, se il problema persiste contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.genericerr)

    }
    errNotPermission() {
        return this.embed
            .setTitle("⚠️ Errore: Permesso negato ⚠️")
            .setDescription("🚫 Spiacenti, non hai i permessi necessari per eseguire questa azione. Contatta un amministratore per assistenza.")
            .setThumbnail(embedconfig.image.notpermission)

    }


    errYourBotton() {
        return this.embed
            .setTitle("⚠️ Ops! Non è il tuo bottone questo ⚠️")
            .setDescription("⚔️Questo bottone non corrispone al tuo id utente, pertanto non potrai usarlo")
            .setThumbnail(embedconfig.image.notpermission)

    }

    errTohigtPermission() {
        return this.embed
            .setTitle("⚠️ Permessi troppo elevati ⚠️")
            .setDescription("⚡La persona a cui stati cercando di applicare la seguente azione dispone di un ruolo più alto del tuo.")
            .setThumbnail(embedconfig.image.notpermission)

    }
    errAreBot() {
        return this.embed
            .setTitle("⚠️ L'utente è un bot ⚠️")
            .setDescription("🤖La persona a cui stati cercando di applicare la seguente azione è un bot pertanto non posso fare nulla.")
            .setThumbnail(embedconfig.image.notpermission)
    }
    errAreYou() {
        return this.embed
            .setTitle("⚠️  L'utente sei tu ⚠️")
            .setDescription("🪃La persona a cui stati cercando di applicare la seguente azione sei tu quindi non posso fare nulla.")
            .setThumbnail(embedconfig.image.notpermission)
    }
}



module.exports = {
    errembed
}