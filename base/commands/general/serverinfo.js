const { ChannelType } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "serverinfo",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "serverinfo",
        description: "ritorna le informazioni del server"
    },
    execute(interaction) {


        return new Promise((resolve, reject) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(() => {
                interaction.guild.invites.create(interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).first().id, { maxAge: 18000, maxUses: 0 }).then((invites) => {
                    interaction.reply({
                        embeds: [embed.serverinfo(interaction.guild, invites)],
                    }).catch((err) => {
                        console.error(err);
                    });
                    resolve(0)
                })
            }).catch((err) => {
                console.log(err)
                reject(ErrEmbed.GENERIC_ERROR)
            })

        });




    }
}