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
        this.embed.setTitle("Nuovo canale creato");
        this.embed.setDescription(`Il canale ${channel} è stato creato`);
        this.embed.setFooter(`Canale creato il ${this.Time.getTime()}`);
        return this.embed;
    }







}

module.exports = { logembed };