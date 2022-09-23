const { PermissionsBitField } = require('discord.js')
const configs = require("./../../index")
const errmsg = require("../../function/msg/errormsg")
module.exports = {
    name: "iclear",
    permision: [PermissionsBitField.Flags.Administrator],
    onlyOwner: true,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "iclear",
        description: "Elimina tutti gli inviti del server",
    },
    execute(interaction) {

        interaction.guild.invites.fetch().then(invites => {
            invites.each(i => i.delete()).catch(()=>{errmsg.genericmsg(interaction)})
        })
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Inviti eliminati")
            .setDescription("Tutti gli inviti sono stati eliminati")
            .setThumbnail(configs.settings.embed.images.succes)
            .setColor(configs.settings.embed.color.green)
        interaction.reply({ embeds: [embed] })

    }
}