const { MessageAttachment,AttachmentBuilder,ChannelType, PermissionsBitField, ButtonStyle } = require("discord.js");
const { Captcha } = require("captcha-canvas");
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const configs = require("./../../../index")
module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        if (member.user.bot) {
            let role = member.guild.roles.cache.find(x => x.id == configs[member.guild.name].role.bot)
            member.roles.add(role)
        } else {

            let captcha = new Captcha();
            captcha.async = true
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();

            let captchaAttachement = new AttachmentBuilder(
                await captcha.png,
                { name:"captcha.png"}
            )
            let category = member.guild.channels.cache.find(x => x.name == "💻verifica💻")
            if (!category) {
                category = await member.guild.channels.create( {
                    name : "💻verifica💻",
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [{
                        id: member.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    }, {
                        id: member.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }]
                })
            }
            let name = "「💻」" + member.user.tag
            let channelverifica = await member.guild.channels.create( {
                name: name,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [{
                    id: member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                }, {
                    id: member.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                }]
            })
            let embed = new configs.Discord.EmbedBuilder()
                .setColor(configs.settings.embed.color.green)
                .setTitle("Welcome")
                .setDescription(`Per verificarti nel server risolvi il captcha(hai 100 sec altrimenti verrai kikkato)`)
                .setImage("attachment://captcha.png")
            let msg = await channelverifica.send({
                embeds: [embed],
                files: [captchaAttachement]
            })
            let filter = (message) => {
                let embed = new configs.Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Impossibile verificarti controlla di aver scritto bene il captcha !! Riprova!")
                    .setColor(configs.settings.embed.color.red)
                    .setThumbnail(configs.settings.embed.images.error)
                if (message.author.id !== member.id) return;
                if (message.content.toUpperCase() === captcha.text) return true;
                else channelverifica.send({ embeds: [embed] })
            }
            console.log(captcha.text)
            textchaptcha = captcha.text
            try {
                response = await msg.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 100000,
                    errors: ["time"],
                })
                if (response) {
                    let embed = new configs.Discord.EmbedBuilder()
                        .setTitle(member.user.tag + " configs.verificato")
                        .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                        .setThumbnail(configs.settings.embed.images.succes)
                        .setColor(configs.settings.embed.color.green)
                    channelverifica.send({ embeds: [embed] })
                    if (!configs.verifica) {
                        for (let role in configs[member.guild.name].role.rolebase) {
                            let roles = member.guild.roles.cache.find(x => x.id == configs[member.guild.name].role.rolebase[role])
                            member.roles.add(roles)
                        }
                    }

                }
            } catch (err) {
                if (configs.verifica) {

                } else {
                    let embed = new configs.Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Ci dispiace che non sei riuscito a verificarti, ma ora dovro kickarti")
                        .setThumbnail(configs.settings.embed.images.thor)
                        .setColor(configs.settings.embed.color.red)
                    await channelverifica.send({ embeds: [embed] })
                    setTimeout(async() => {
                        await member.kick()
                    }, 1000 * 10)
                }

            }
            let messagedelete = new configs.Discord.EmbedBuilder()
                .setTitle("Posso cancellare la chat?")
                .setDescription("Posso cancellare la chat ?")
                .setThumbnail(configs.settings.embed.images.load)
                .setColor(configs.settings.embed.color.red)
            let row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('deletechat')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("<:cestino:940545919928111126>"),
                );
            let category1 = member.guild.channels.cache.find(x => x.name == "📂Backup📂")
            if (!category1) {
                category1 = await member.guild.channels.create('📂Backup📂', {
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [{
                        id: member.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }]
                })
            }

            await channelverifica.permissionOverwrites.delete(member.id).then((channels) => {
                channels.setParent(category1);
            })
            category.delete().catch(() => {})
            channelverifica.send({ embeds: [messagedelete], components: [row] })





        }


    }
};