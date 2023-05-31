const { EmbedBuilder, AttachmentBuilder } = require("discord.js")
const { createCanvas } = require('canvas')
const cembed = require("./../../../settings/embed.json")
const { genericerr } = require("../../err/generic");
const { createrowavatar, createrowbanner } = require("../../../functions/row/createrow");
const axios = require("axios")


async function avatarembed(interaction, member) {
    try {

        let row = createrowbanner(interaction, member)

        var embed = new EmbedBuilder()
            .setTitle(member.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(cembed.color.verde)
            .setImage(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }) || cembed.image.notimmage)
        if (interaction.isChatInputCommand())
            interaction.reply({ embeds: [embed], components: [row] })
        else {
            interaction.update({ embeds: [embed], files: [], components: [row] })
        }
    } catch (err) { genericerr(interaction, err) }
}
async function bannerembed(interaction, member) {
    try {
        let row = createrowavatar(interaction, member)
        axios.get(`https://discord.com/api/v10/users/${member.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`
            }
        })
            .then(async response => {
                var embed = new EmbedBuilder()
                    .setTitle(member.user.tag)
                    .setDescription("Il banner di questo utente")
                    .setColor(cembed.color.verde)

                const { banner, accent_color, banner_color } = response.data
                if (banner) {
                    const extension = banner.startsWith("a_") ? `.gif` : `.png`;
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=512`
                    embed.setImage(url)
                    interaction.update({ embeds: [embed], components: [row] })
                } else {
                    console.log(accent_color || banner_color)
                    if (accent_color || banner_color) {
                        let canvas = await createCanvas(1024, 408)
                        let ctx = await canvas.getContext('2d')

                        ctx.fillStyle = accent_color || banner_color
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'canvas.png' })
                        embed
                            .setImage('attachment://canvas.png');
                        interaction.update({ embeds: [embed], files: [attachment], components: [row] })
                    }
                }

            })

    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
}





module.exports = { avatarembed, bannerembed }