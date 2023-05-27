const { userinfoembed } = require('../../embeds/commands/general/general');
const { PermissionsBitField } = require("discord.js")
module.exports = {
    name: "userinfo",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "userinfo",
        description: "comando per avere informazioni su un utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {

        let member = interaction.options.getMember("user")
        if (!member)
            member = interaction.member


        let elencoPermessi = [];
        if (member.id == interaction.guild.ownerId) {
            elencoPermessi.push("👑 Owner");
        } else {
            if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                elencoPermessi.push("👑 ADMINISTRATOR");
            } else {
                elencoPermessi = member.permissions.toArray()
            }
        }
        userinfoembed(interaction, member, elencoPermessi)


    }
}