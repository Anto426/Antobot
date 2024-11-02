const { comandbembed } = require("../../../embed/base/command");
const { PermissionsBitField } = require("discord.js");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json");
const { errorIndex } = require("../../../function/err/errormenager");
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
                    name: "title",
                    description: "Il titolo dell'annuncio",
                    type: 3,
                    required: false
                },
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
                },
                {
                    name: "thumbnail",
                    description: "Vuoi inser una thumbnail?",
                    type: 3,
                    required: false
                },
                {
                    name: "image",
                    description: "Vuoi inserire un immagine?",
                    type: 3,
                    required: false
                },
                {
                    name: "color",
                    description: "Vuoi inserire un colore?",
                    type: 3,
                    required: false
                }
            ]
    },
    async execute(interaction) {

        return new Promise(async (resolve, reject) => {
            try {
                let embed = new comandbembed(interaction.guild, interaction.member);
                let message = interaction.options.getString('message');
                let tag = interaction.options.getBoolean('tag_everyone');
                let thumbnail = interaction.options.getString('thumbnail');
                let image = interaction.options.getString('image');
                let color = interaction.options.getString('color');
                let embedcolor = color ? color.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) ? color : null : null;
                let everyone = tag ? interaction.guild.roles.everyone : "";
                let title = interaction.options.getString('title') || "Annuncio";
                await embed.init();
                let json = new Cjson();
                let data = await json.readJson(process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig);

                if (!data[interaction.guild.id].channel.events || !interaction.guild.channels.cache.get(data[interaction.guild.id].channel.events)) {
                    reject(errorIndex.CHANNEL_NOT_FOUND_ERROR);
                } else {
                    let channel = interaction.guild.channels.cache.get(data[interaction.guild.id].channel.events);
                    console.log(title, message, thumbnail, image, embedcolor);
                    await channel.send({ content: everyone.toString(), embeds: [embed.annunce(title, message, thumbnail, image, embedcolor)] });
                    await interaction.reply({
                        content: "Annuncio inviato con successo!",
                        ephemeral: true,
                    });
                }
                resolve(0);
            } catch (err) {
                console.error(err);
                reject(errorIndex.GENERIC_ERROR);
            }
        });

    }
}