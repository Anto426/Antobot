const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const { sendto } = require('../../functions/msg/msg')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "ban",
    permisions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: true,
    test: true,

    data: {
        name: "ban",
        description: "banna utente",
        options: [{
            name: "user",
            description: "utente",
            type: 6,
            required: true,
        },
        {
            name: "reason",
            description: "motivo",
            type: 3,
            required: false,
        }
        ]
    },
    async execute(interaction) {
        let user = interaction.options.getMember("user") || "Nothing"
        let reason = interaction.options.getString("reason")
        let embed1 = new EmbedBuilder()
            .setTitle("Utente Bannato")
            .setDescription("Sei stato bannato da " + interaction.guild.toString())
            .addFields([{ name: `Reason:`, value: `\`\`\`\n${reason}\`\`\`` }])
            .setColor(cembed.color.Red)
        let content = { embeds: [embed1] }
        await sendto(user, content, interaction.channel).then(() => {
            let embed = new EmbedBuilder()
                .setTitle("Utente Bannato")
                .setDescription(user.toString() + "è stato bannato con succeso")
                .addFields([{ name: `Reason:`, value: `\`\`\`\n${reason}\`\`\`` }])
                .setColor(cembed.color.Red)
            interaction.reply({ embeds: [embed] })
            setTimeout(() => {

            }, 1000);

        })


    }
}
