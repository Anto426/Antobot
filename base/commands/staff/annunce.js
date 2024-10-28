const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { PermissionsBitField } = require("discord.js");
const setting = require("../../../setting/settings.json");
const { Cjson } = require("../../../function/file/json");
module.exports = {
    name: "announce",
    permisions: [PermissionsBitField.Flags.ManageGuild],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "announce",
        description: "Comando per inviare un annuncio nel Server",
        options:
            [
                {
                    name: "message",
                    description: "Il messaggio da inviare",
                    type: 3,
                    required: true
                },
                {
                    name: "tag_everyone",
                    description: "Vuoi taggare everyone?",
                    type: 5,
                    required: true
                }
            ]
    },
    execute: async (interaction) => {
        try {
            let embed = new comandbembed(interaction.guild, interaction.member);
            let message = interaction.options.getString('message');
            let tag = interaction.options.getBoolean('tag_everyone');
            let everyone = tag ? interaction.guild.roles.everyone : "";

            await embed.init();
            let json = new Cjson();
            let data = await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig);

            if (!data[interaction.guild.id].channel.rule || !interaction.guild.channels.cache.get(data[interaction.guild.id].channel.rule)) {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                await embedmsg.init();
                await interaction.reply({ embeds: [embedmsg.ChannelnotFoundError()], ephemeral: true });
            } else {
                let channel = interaction.guild.channels.cache.get(data[interaction.guild.id].channel.rule);
                await channel.send({ embeds: [embed.annunce(message, everyone)] });
                await interaction.reply({
                    content: "Annuncio inviato con successo!",
                    ephemeral: true
                });
            }
        } catch (err) {
            console.error(err);
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
            try {
                await embedmsg.init();
                await interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true });
            } catch (innerErr) {
                console.error(innerErr);
            }
        }
    }
}