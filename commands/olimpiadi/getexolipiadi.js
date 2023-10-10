const { PermissionsBitField } = require('discord.js');
const { createrowgitol } = require('../../functions/row/createrow');
const cguild = require("./../../settings/guild.json");
const { exoisembedf } = require('../../embeds/commands/general/olimpiadiembed');
module.exports = {
    name: "getexolipiadi",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: false,
    getMol: true,
    test: false,
    data: {
        name: "getexolipiadi",
        description: "Comando per farsi inviare "
    },
    async execute(interaction) {
        try {
            createrowgitol(interaction).then(({ row, ex }) => {
                exoisembedf(interaction, row, ex)
            })
        } catch (err) {
            genericerr(interaction, err);
        }
    }
}