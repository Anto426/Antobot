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


    








}

module.exports = { logembed };