const errmsg = require("../msg/errormsg")
const configs = require("./../../index")
// Ban function 
async function banf(interaction, member, reason) {
    try {
        member.ban({
            reason: reason
        });
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
        const embeddm = new configs.Discord.EmbedBuilder()
            .setTitle("Sei stato bannato dal server mi dispiace,per la prossima volta impara a rispettare le regole")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        member.send({ embeds: [embeddm] }).catch(() => { errmsg.dmmessage(interaction) })
    } catch (err) {
        console.error(err)
        errmsg.genericmsg(interaction)
    }
}


async function unbanf(interaction, id) {
    let a = true
    try {
        interaction.guild.bans.fetch().then(banned => {
            banned.forEach(element => {
                if (element.user.id.toString() == id)
                    a = false
            })
        }).then(x => {

            if (!a) {
                interaction.guild.members.unban(id)
                const embed = new configs.Discord.EmbedBuilder()
                    .setTitle("Utente sbannato")
                    .setDescription("Utente sbannato")
                    .setThumbnail(configs.settings.embed.images.succes)
                    .setColor(configs.settings.embed.color.green)
                interaction.reply({ embeds: [embed] })
            } else {
                const embed = new configs.Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Utente gia sbannato")
                    .setThumbnail(configs.settings.embed.images.error)
                    .setColor(configs.settings.embed.color.red)
                interaction.reply({ embeds: [embed] })
            }
        })
        return
    } catch {
        errmsg.genericmsg(interaction)
    }
}



// Kick function 
async function kickf(interaction, member) {
    try {
        member.kick();
        let frasi = ["La prossima volta rispetta le regole coglione " + "<@" + member + ">" + " bannato"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription(frasi[x])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
    } catch (err) {
        console.error(err)
        errmsg.genericmsg(interaction)
    }


}


// Mute function 
async function mutef(interaction, member, reason) {
    if (member.user.bot) {
        errmsg.botmsg(interaction)

    }

    let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")
    if (!muted) {
        muted = await interaction.guild.roles.create({
            name: "MutedA",
            permissions: [""]
        })
        interaction.guild.channels.cache.forEach(channel => {
            channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false })
        });
    }
    if (member.roles.cache.has(muted.id)) {
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Error")
            .setDescription(member.user.tag + " risulta già mutato")
            .setThumbnail(configs.settings.embed.images.error)
            .setColor(configs.settings.embed.color.red)
        interaction.reply({ embeds: [embed] })
        return
    }
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Utente mutato")
        .addFields([
            { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
        ])
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription("<@" + member + ">" + " mutato")
        .setColor(configs.settings.embed.color.green)
    member.roles.add(muted).catch(() => {
        errmsg.genericmsg(interaction)
        return
    })
    interaction.reply({ embeds: [embed] })
    const embed1 = new configs.Discord.EmbedBuilder()
        .setTitle("Utente mutato")
        .addFields([
            { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
        ])
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription("<@" + member + "> sei stato mutato ")
        .setColor(configs.settings.embed.color.green)
    member.send({ embeds: [embed1] }).catch(() => {
        errmsg.dmmessage(interaction)
    })
}


// timeout function 

async function timeoutf(interaction, member, reason) {
    if (member.user.bot) {
        errmsg.botmsg(interaction)

    }
    if (member.communicationDisabledUntilTimestamp == null || member.communicationDisabledUntilTimestamp < Date.now()) {




        member.timeout(time, reason).catch((err) => {
            errmsg.genericmsg(interaction)
            return

        })
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente timeoutato")
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + member + ">" + " timeoutato per " + timefunctions.times(time))
            .setColor(configs.settings.embed.color.green)
        interaction.reply({ embeds: [embed] })

    } else {
        const d = new Date(member.communicationDisabledUntilTimestamp);
        date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
        console.log(date);
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Error")
            .setDescription(`${member.toString()} ha già un timeout!`)
            .addFields([
                { name: 'Fino a :', value: `\`\`\`\n ${date} \`\`\`` },
            ])
            .setThumbnail(configs.settings.embed.images.error)
            .setColor(configs.settings.embed.color.red)
        interaction.reply({ embeds: [embed] })
    }
}



module.exports = {
    banf: banf,
    unbanf:unbanf,
    kickf: kickf,
    mutef: mutef,
    timeoutf: timeoutf

}