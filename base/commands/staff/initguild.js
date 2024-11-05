const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { comandbembed } = require("../../../embed/base/command");
const { Cjson } = require("../../../function/file/json");
const setting = require("../../../setting/settings.json");
const { errorIndex } = require("../../../function/err/errormenager");
module.exports = {
    name: "initguild",
    permisions: [PermissionsBitField.Flags.ManageGuild],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "initguild",
        description: "Inzia un processo per abilitare il bot in un server"
    },
    execute(interaction) {
        return new Promise((resolve, reject) => {

            let embed = new comandbembed(interaction.guild, interaction.member)
            let json = new Cjson()
            let root = process.env.dirdatabase + setting.database.root + "/" + setting.database.guildconfig

            embed.init().then(() => {

                let embedmsg = embed.intitguild(interaction.guild)
                let button = new ButtonBuilder()
                    .setCustomId(`initguild-${interaction.member.id}-0-0`)
                    .setLabel('🚀 Avvia')
                    .setStyle(ButtonStyle.Success)

                json.readJson(root).then((data) => {
                    if (data[interaction.guild.id]) {
                        embedmsg.setDescription(`Il server **${interaction.guild.name}** è già stato inizializzato\n🔧 Se vuoi reinizializzare il server clicca sul bottone qui sotto`)
                        button.setLabel('🚀 Modifica la configurazione').setCustomId(`initguild-${interaction.member.id}-0-0-r`)
                    }

                    let actionRow = new ActionRowBuilder().addComponents(button)
                    interaction.reply({ embeds: [embedmsg], components: [actionRow] }).catch((err) => {
                        console.error(err);
                    })
                    resolve(0)

                }).catch((err) => {
                    console.log(err)
                    reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)

                })

            }).catch((err) => {
                console.log(err)
                reject(errorIndex.REPLY_ERRORS.GENERIC_ERROR)
            })

        });

    }
}