const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: "unban",
    permision: [PermissionsBitField.Flags.BanMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "unban",
        description: "Unban utente",
        options: [{
            name: "iduser",
            description: "id dell'utente interessato",
            type: 3,
            required: true
        }]
    },
    execute(interaction) {
        var id = interaction.options.getString("iduser")



    }
}