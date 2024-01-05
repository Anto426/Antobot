const { EmbedBuilder } = require("discord.js");

class errembed {
    constructor(guild, member) {
        this.guild = guild
        this.member = member
        this.owner = {}
        this.Author = {}
        this.embed = new EmbedBuilder()
    }
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.owner = await this.guild.fetchOwner()
                this.embed
                    .setTimestamp()
                    .setAuthor({
                        name: this.owner.user.username,
                        iconURL: this.owner.user.displayAvatarURL({
                            dynamic: true,
                            format: "png",
                            size: 512
                        })

                    })
                    .setColor(embedconfig.color.red)
                    .setFooter({
                        text: "📢 Richiesta effetuata da " + this.member.user.username,
                        iconURL: this.member.user.displayAvatarURL({
                            dynamic: true,
                            format: "png",
                            size: 512
                        })
                    });

                resolve(0)
            } catch (err) {
                console.log(err)
                reject(-1)
            }
        })
    } 1
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
            .setDescription("🪃La persona a cui stati cercando di applicare la seguente azione sei tu quaindi non posso farlo.")
            .setThumbnail(embedconfig.image.notpermission)
    }
}



module.exports = {
    errembed
}