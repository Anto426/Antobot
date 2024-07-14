const { BaseEmbed } = require("../baseembed");

class CommandEmbed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member);
    }

    initialize() {
        return new Promise((resolve, reject) => {
            super.initialize().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.purple); resolve(0); }).catch(() => { reject(-1); });
        });
    }

    play() {
        return this.embed
            .setDescription("PROVA")
            .setTitle("PROVA");
    }
}

module.exports = { CommandEmbed };