const { EmbedBuilder } = require('discord.js');
const cembed = require("./../../setting/embed.json");
const { serverinfoembed } = require('../../embeds/commands/general/general');
module.exports = {
    name: "serverinfo",
    permisions: [],
    allowedchannels: global.AllowCommands,
    position: false,
    test: false,
    data: {
        name: "serverinfo",
        description: "Informazioni sul server"
    },
    async execute(interaction) {
        serverinfoembed(interaction)
    }
}