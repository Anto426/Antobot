const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const errmsg = require("../msg/errormsg.js");
const { sendto } = require("../msg/msg.js");
const { times } = require("../time/timef");
const cembed = require("../../setting/embed.json")


// Ban function 
async function banf(interaction, member, reason) {
    try {

        const embed = new EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color["Green Blue"])
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
        const embeddm = new EmbedBuilder()
            .setTitle("Sei stato bannato dal server mi dispiace,per la prossima volta impara a rispettare le regole")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color["Green Blue"])
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        await sendto(member, { embeds: [embeddm] }, interaction.channel)
        setTimeout(() => {
            member.ban({
                reason: reason
            });
        }, 1000 * 1);

    } catch (err) { errmsg.genericmsg(interaction) }
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
                const embed = new EmbedBuilder()
                    .setTitle("Utente sbannato")
                    .setDescription("Utente sbannato")
                    .setThumbnail(cembed.immage.load)
                    .setColor(cembed.color["Green Blue"])
                interaction.reply({ embeds: [embed] })
            } else {
                const embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Utente gia sbannato")
                    .setThumbnail(cembed.immage.err)
                    .setColor(cembed.color.Red)
                interaction.reply({ embeds: [embed] })
            }
        })
        return
    } catch { errmsg.genericmsg(interaction) }
}



// Kick function 
async function kickf(interaction, member) {
    try {
        let frasi = ["La prossima volta rispetta le regole coglione " + "<@" + member + ">" + " bannato"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription(frasi[x])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color["Green Blue"])
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
        const embeddm = new EmbedBuilder()
            .setTitle("Sei stato kikato dal server mi dispiace,per la prossima volta impara a rispettare le regole")
            .setDescription("<@" + member + ">" + " kikato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color["Green Blue"])
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        await sendto(member, { embeds: [embeddm] }, interaction.channel)
        setTimeout(() => {
            member.kick();
        }, 1000 * 1);

    } catch { }


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
            channel.permissionOverwrites.set([
                {
                    id: muted.id,
                    deny: [PermissionsBitField.Flags.SendMessages],
                }
            ])
        });
    }
    if (member.roles.cache.has(muted.id)) {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(member.user.tag + " risulta già mutato")
            .setThumbnail(cembed.color.Red)
            .setColor(cembed.color.Red)
        interaction.reply({ embeds: [embed] })
        return
    }
    const embed = new EmbedBuilder()
        .setTitle("Utente mutato")
        .addFields([
            { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
        ])
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription("<@" + member + ">" + " mutato")
        .setColor(cembed.color["Green Blue"])

    interaction.reply({ embeds: [embed] })
    const embeddm = new EmbedBuilder()
        .setTitle("Utente mutato")
        .addFields([
            { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
        ])
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription("<@" + member + "> sei stato mutato ")
        .setColor(cembed.color["Green Blue"])
    await sendto(member, { embeds: [embeddm] }, interaction.channel)
    member.roles.add(muted).catch(() => {
        errmsg.genericmsg(interaction)
        return
    })
}

async function unmute(interaction, member) {
    if (member.user.bot) {
        errmsg.bot(interaction)
        return interaction.reply({ embeds: [embed] })

    }

    let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")


    if (!member.roles.cache.has(muted.id)) {
        const embed = new EmbedBuilder()
            .setTitle(interaction.member.user.tag + " Error")
            .setDescription(member.user.tag + " risulta già smutato")
            .setThumbnail(cembed.color.Red)
            .setColor(cembed.color.Red)
        interaction.reply({ embeds: [embed] })
        return
    }
    const embed = new EmbedBuilder()
        .setTitle("Utente smutato")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription("<@" + member + ">" + " smutato")
        .setColor(cembed.color["Green Blue"])
    interaction.reply({ embeds: [embed] })
    member.roles.remove(muted).catch(() => { errmsg.genericmsg(interaction) })
}

// timeout function 

async function timeoutf(interaction, member, time, reason) {
    if (member.user.bot) {
        errmsg.botmsg(interaction)

    }
    if (member.communicationDisabledUntilTimestamp == null || member.communicationDisabledUntilTimestamp < Date.now()) {

        member.timeout(time, reason).then(() => {
            const embed = new EmbedBuilder()
                .setTitle("Utente timeoutato")
                .addFields([
                    { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
                ])
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + member + ">" + " timeoutato per " + times(time))
                .setColor(cembed.color["Green Blue"])
            interaction.reply({ embeds: [embed] })


        }).catch(() => {
            errmsg.genericmsg(interaction)
            return
        })

    } else {
        const d = new Date(member.communicationDisabledUntilTimestamp);
        date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
        console.log(date);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`${member.toString()} ha già un timeout!`)
            .addFields([
                { name: 'Fino a :', value: `\`\`\`\n ${date} \`\`\`` },
            ])
            .setThumbnail(cembed.color.Red)
            .setColor(cembed.color.Red)
        interaction.reply({ embeds: [embed] })
    }
}

async function untimioutf(interaction, member,) {
    if (member.user.bot) {
        errmsg.botmsg(interaction)
        return interaction.reply({ embeds: [embed] })

    }

    if (member.communicationDisabledUntilTimestamp != null || member.communicationDisabledUntilTimestamp > Date.now()) {
        member.timeout(null)
        const embed = new EmbedBuilder()
            .setTitle("Utente untimeoutato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + member + ">" + " untimeoutato")
            .setColor(cembed.color["Green Blue"])
        interaction.reply({ embeds: [embed] })

    } else {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`${member.toString()} non ha un timeout!`)
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.Red)
        interaction.reply({ embeds: [embed] })
    }
}


module.exports = {
    banf,
    unbanf,
    kickf,
    mutef,
    unmute,
    timeoutf,
    untimioutf

}