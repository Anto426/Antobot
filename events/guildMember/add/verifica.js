const { MessageAttachment } = require("discord.js");
const { Captcha } = require("captcha-canvas");
const { ActionRowBuilder, ButtonBuilder,ButtonStyle } = require('discord.js');
const configs = require("./../../index")
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

            let captchaAttachement = new MessageAttachment(
                await captcha.png,
                "captcha.png"
            )
            let category = member.guild.channels.cache.find(x => x.name == "💻verifica💻")
            if (!category) {
                category = await member.guild.channels.create('💻verifica💻', {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [{
                        id: member.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    }, {
                        id: member.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
                    }]
                })
            }
            let name = "「💻」" + member.user.tag
            let channelverifica = await member.guild.channels.create(name, {
                type: 'GUILD_TEXT',
                parent: category,
                permissionOverwrites: [{
                    id: member.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                }, {
                    id: member.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }]
            })
            let embed = new Discord.EmbedBuilder()
                .setColor("RANDOM")
                .setTitle("Welcome")
                .setDescription(`Per verificarti nel server risolvi il captcha(hai 100 sec altrimenti verrai kikkato)`)
                .setImage("attachment://captcha.png")
            let msg = await channelverifica.send({
                embeds: [embed],
                files: [captchaAttachement]
            })
            let filter = (message) => {
                let embed = new Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Impossibile verificarti controlla di aver scritto bene il captcha !! Riprova!")
                    .setColor(configs.config.embed.color.red)
                    .setThumbnail(configs.config.embed.images.error)
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
                    let embed = new Discord.EmbedBuilder()
                        .setTitle(member.user.tag + " verificato")
                        .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                        .setThumbnail(configs.config.embed.images.succes)
                        .setColor(configs.config.embed.color.green)
                    channelverifica.send({ embeds: [embed] })
                    if (!verifica) {
                        for (let role in configs[member.guild.name].role.rolebase) {
                            let roles = member.guild.roles.cache.find(x => x.id == configs[member.guild.name].role.rolebase[role])
                            member.roles.add(roles)
                        }
                    }

                }
            } catch (err) {
                if (verifica) {

                } else {
                    let embed = new Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Ci dispiace che non sei riuscito a verificarti, ma ora dovro kickarti")
                        .setThumbnail(configs.config.embed.images.thor)
                        .setColor(configs.config.embed.color.red)
                    await channelverifica.send({ embeds: [embed] })
                    setTimeout(async() => {
                        await member.kick()
                    }, 1000 * 10)
                }

            }
            let messagedelete = new Discord.EmbedBuilder()
                .setTitle("Posso cancellare la chat?")
                .setDescription("Posso cancellare la chat ?")
                .setThumbnail(configs.config.embed.images.load)
                .setColor(configs.config.embed.color.red)
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
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [{
                        id: member.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
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