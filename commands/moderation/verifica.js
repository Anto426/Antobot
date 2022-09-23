const { PermissionsBitField } = require('discord.js')
const configs = require("./../../index")
const errormsg = require("../../function/msg/errormsg")
const errmsg = require("./../../function/msg/errormsg")
module.exports = {
    name: "verifica",
    permision: [],
    onlyStaff: true,
    onlyOwner: false,
    defaultchannel: true,
    data: {
        name: "verifica",
        description: "Verifica utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }]
    },
    execute(interaction) {
        var utente = interaction.options.getMember("user")

        console.log(utente.roles.cache.size)
        if (utente.roles.cache.size == 1) {

            for (let id in configs.settings[interaction.guild.name].role.rolebase) {
                let role = interaction.guild.roles.cache.find(x => x.id == configs.settings[interaction.guild.name].role.rolebase[id])
                utente.roles.add(role).catch(() => { })

            }

            verifica = true
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle(utente.user.tag + " verificato")
                .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
                .setColor(configs.settings.embed.color.green)
            interaction.reply({ embeds: [embed] })

            const embed1 = new configs.Discord.EmbedBuilder()
                .setTitle(utente.user.tag + " verificato")
                .setDescription(utente.user.tag + " sei stato verificato alle  ore " + new Date().getHours() + ":" + new Date().getMinutes() + " da " + interaction.member.user.tag)
                .setThumbnail(configs.settings.embed.images.succes)
                .setColor(configs.settings.embed.color.green)
            utente.send({ embeds: [embed1] }).catch(() => {
                errormsg.dmmessage(interaction)


            })






        }else{
            errmsg.genericmsg(interaction)
        }



    }
}