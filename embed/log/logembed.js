const { BaseEmbed } = require("../baseembed");

class logembed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member);
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.orange); resolve(0); }).catch(() => { reject(-1); });
        });
    }


    addchannel(channel) {
        return this.embed
            .setTitle("📢 Nuovo canale creato")
            .setDescription(`Il canale ${channel} è stato creato`)
            .setFooter(`Canale creato il ${this.Time.getTime()}`)
    }

    deletechannel(channel) {
        return this.embed
            .setTitle("🗑️ Canale eliminato")
            .setDescription(`Il canale ${channel} è stato eliminato`)
            .setFooter(`Canale eliminato il ${this.Time.getTime()}`)
    }

    updatechannel(oldChannel, changedprop) {
        return this.embed
            .setTitle("✏️ Canale modificato")
            .setDescription(`Il canale ${oldChannel.name} è stato modificato in ${newChannel.name}`)
            .addField("🔧 Proprietà modificate", changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n"))
            .setFooter(`Canale modificato il ${this.Time.getTime()}`);
    }


    emojiCreate(emoji) {
        return this.embed
            .setTitle("🎨 Nuova emoji creata")
            .setDescription(`La nuova emoji ${emoji} è stata creata`)
            .setFooter(`Emoji creata il ${this.Time.getTime()}`)
    }


    emojiDelete(emoji) {
        return this.embed
            .setTitle("🗑️ Emoji eliminata")
            .setDescription(`L'emoji ${emoji} è stata eliminata`)
            .setFooter(`Emoji eliminata il ${this.Time.getTime()}`)
    }



    emojiUpdate(oldEmoji, newEmoji) {
        return this.embed
            .setTitle("✏️ Emoji modificata")
            .setDescription(`L'emoji ${oldEmoji} è stata modificata in ${newEmoji}`)
            .setFooter(`Emoji modificata il ${this.Time.getTime()}`)
    }


    guildBanAdd(user, reason) {
        return this.embed
            .setTitle("🔨 Utente bannato")
            .setDescription(`L'utente ${user.globalName ? user.globalName : user.tag} è stato bannato`)
            .addFields(
                {
                    name: "🔨 Motivo",
                    value: reason.toString(),
                }
            )
            .setFooter(`Utente bannato il ${this.Time.getTime()}`)
    }

    guildBanRemove(user) {
        return this.embed
            .setTitle("🔨 Utente sbannato")
            .setDescription(`L'utente ${user.globalName ? user.globalName : user.tag} è stato sbannato`)
            .setFooter(`Utente sbannato il ${this.Time.getTime()}`)
    }


    guildMemberUpdate(member, changedprop) {
        return this.embed
            .setTitle("✏️ Utente modificato")
            .setDescription(`L'utente ${member.globalName ? member.globalName : member.tag} è stato modificato`)
            .addField("🔧 Proprietà modificate", changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n"))
            .setFooter(`Utente modificato il ${this.Time.getTime()}`);
    }


    guildUpdate(newGuild, changedprop) {
        return this.embed
            .setTitle("✏️ Server modificato")
            .setDescription(`Il server ${newGuild.name} è stato modificato`)
            .addField("🔧 Proprietà modificate", changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n"))
            .setFooter(`Server modificato il ${this.Time.getTime()}`);
    }


    inviteCreate(invite) {
        return this.embed
            .setTitle("🔗 Invito creato")
            .setDescription(`Il nuovo invito ${invite} è stato creato`)
            .addFields(
                {
                    name: "🔗 Creatore",
                    value: `${invite.inviter.globalName ? invite.inviter.globalName : invite.inviter.tag}`,
                    inline: true
                },
                {
                    name: "🔗 Usi",
                    value: invite.uses,
                    inline: true
                },
                {
                    name: "🔗 Scadenza",
                    value: invite.expiresAt,
                    inline: true
                }
            )
            .setFooter(`Invito creato il ${this.Time.getTime()}`)
    }











}

module.exports = { logembed };