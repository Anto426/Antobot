const { ChannelType, PermissionsBitField } = require("discord.js");
const { WriteCommand } = require("../../../function/commands/WriteCommand");
const { EventEmbed } = require("../../../embed/base/events");
const { BotConsole } = require("../../../function/log/botConsole");
const { errorIndex } = require("../../../function/err/errormenager");


module.exports = {
    name: "NewGuild",
    typeEvent: "guildCreate",
    allowevents: true,
    async execute(guild) {
        return new Promise((resolve, reject) => {
            new WriteCommand().commandGuild(guild).catch(() => { });
            let botconsole = new BotConsole();
            let embed = new EventEmbed(guild);
            embed.init().then(async () => {
                try {
                    botconsole.log("Il bot e entrato in" + guild.name, "green");
                    const defaultChannel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);
                    defaultChannel.send({ embeds: [embed.newguild(guild)] }).catch((err) => { console.log(err) });

                } catch (error) {
                    reject(errorIndex.FETCH_DATA_ERROR);
                }
                resolve(0);
            }).catch(() => {
                reject(errorIndex.GENERIC_ERROR.internal = true);
            })

        })

    }
};