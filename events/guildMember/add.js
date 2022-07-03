const { MessageAttachment } = require("discord.js");
const { Captcha } = require("captcha-canvas");
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        if (member.user.bot) {
            let role = member.guild.roles.cache.find(x => x.id == configs[member.guild.name].role.bot)
            member.roles.add(role)
        } else {

            let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
            let message = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Welcome")
                .setDescription(` ${member} Benvenuto su ${member.guild.name} te sei il ${humans.size} membro  ! Ti consiglio di andare a leggere il regolamento per non essere bannato !!`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
            let channel = member.guild.channels.cache.find(x => x.id == configs[member.guild.name].stanze.welcome)
            channel.send({ embeds: [message] });

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
            let msg = await channelverifica.send({
                files: [captchaAttachement],
                content: "<@" + member.id + ">" + " Per verificarti nel server risolvi il captcha(hai 100 sec altrimenti verrai kikkato)"
            })
            let filter = (message) => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription("Impossibile verificarti controlla di aver scritto bene il captcha !! Riprova!")
                    .setColor(configs.embed.color.red)
                    .setThumbnail(configs.embed.images.error)
                if (message.author.id !== member.id) return;
                if (message.content.toUpperCase() === captcha.text) return true;
                else channelverifica.send({ embeds: [embed] })
            }
            textchaptcha = captcha.text
            try {
                response = await msg.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 100000,
                    errors: ["time"],
                })
                if (response) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(member.user.tag + " verificato")
                        .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                        .setThumbnail(configs.embed.images.succes)
                        .setColor(configs.embed.color.green)
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
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription("Ci dispiace che non sei riuscito a verificarti, ma ora dovro kickarti")
                        .setThumbnail(configs.embed.images.thor)
                        .setColor(configs.embed.color.red)
                    await channelverifica.send({ embeds: [embed] })
                    setTimeout(async() => {
                        await member.kick()
                    }, 1000 * 10)
                }

            }
            let messagedelete = new Discord.MessageEmbed()
                .setTitle("Posso cancellare la chat?")
                .setDescription("Posso cancellare la chat ?")
                .setThumbnail(configs.embed.images.load)
                .setColor(configs.embed.color.red)
            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('deletechat')
                    .setStyle('DANGER')
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