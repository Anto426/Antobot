const { ChannelType } = require("discord.js");
const { WriteCommand } = require("../../../function/commands/WriteCommand");
const { EventEmbed } = require("../../../embed/base/events");


module.exports = {
    name: "NewGuild",
    typeEvent: "guildCreate",
    allowevents: true,
    async execute(guild) {
        new WriteCommand().commandGuild(guild).catch(() => { });
        let embed = new EventEmbed(guild);
        embed.init().then(() => {
            guild.channels.cache.filter(x => x.type === ChannelType.GuildText).first().send({ embeds: [embed.newguild(guild)] }).catch((err) => { console.log(err) });
        }).catch(() => { })
    }
};