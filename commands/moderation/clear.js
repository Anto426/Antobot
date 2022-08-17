const { PermissionsBitField } = require('discord.js');
const configs = require("./../../index")
module.exports = {
    name: 'clear',
    description: 'Elimina i messaggi specificando la quantita.',
    permision: [PermissionsBitField.Flags.ManageMessages],
    onlyOwner: false,
    onlyStaff : false,
    data: {
        name: "clear",
        description: "comando invita",
        option: [{
            name: 'n',
            description: 'Seleziona la quantita dei messaggi da eliminare.',
            type: 'NUMBER',
            required: true
        }],
    },

    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber('amount');

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
            .setColor(configs.config.embed.color.green)
        await channel.bulkDelete(Amount, true).then(messages => {
            Response.setDescription(`Eliminati ${messages.size} da ${interaction.channel.name}`);
            interaction.reply({ embeds: [Response] });
        })

    }
}