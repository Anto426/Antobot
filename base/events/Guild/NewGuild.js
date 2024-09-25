const { ChannelType, PermissionsBitField } = require("discord.js");
const { WriteCommand } = require("../../../function/commands/WriteCommand");
const { EventEmbed } = require("../../../embed/base/events");
const { BotConsole } = require("../../../function/log/botConsole");


module.exports = {
    name: "NewGuild",
    typeEvent: "guildCreate",
    allowevents: true,
    async execute(guild) {
        new WriteCommand().commandGuild(guild).catch(() => { });
        let botconsole = new BotConsole();
        let embed = new EventEmbed(guild);
        embed.init().then( async () => {
            try {
                botconsole.log("Il bot e entrato in" + guild.name, "green");
                const defaultChannel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);
                defaultChannel.send({ embeds: [embed.newguild(guild)] }).catch((err) => { console.log(err) });
        
            } catch (error) {
                console.error('Errore nel recupero degli inviti:', error);
            }
        
            guild.channels.cache.filter(x => x.type === ChannelType.GuildText).first().send({ embeds: [embed.newguild(guild)] }).catch((err) => { console.log(err) });
        }).catch(() => { })
    }
};