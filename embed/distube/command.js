const { baseembed } = require("../baseembed");

class comanddembed extends baseembed {
    constructor(guild, member) {
        super(guild, member)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.purple); resolve(0) }).catch(() => { reject(-1) })
        })
    }


    play() {
        return this.embed
            .setDescription("PROVA")
            .setTitle("PROVA")
    }


}

module.exports = { comanddembed }