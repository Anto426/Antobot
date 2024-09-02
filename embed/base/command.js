const { BaseEmbed } = require("../baseembed");
const packagejson = require("../../package.json");
const { ChannelType } = require("discord.js");
class comandbembed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.green); resolve(0) }).catch(() => { reject(-1) })
        })
    }

    ping(latency, ram, Time) {
        return this.embed
            .setTitle("Pong 🏓")
            .setDescription("Questo comando restituisce le statistiche del bot")
            .addFields(
                {
                    name: "📶 Latenza",
                    value: latency ? latency : "Sconosciuta",
                    inline: true
                },
                {
                    name: "💻 Ram",
                    value: ram ? ram : "Sconosciuta",
                    inline: true
                },
                {
                    name: "⏲️ Tempo di accensione",
                    value: Time ? Time : "Sconosciuto",
                    inline: false
                },
            )
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }));
    }

    help() {
        return this.embed
            .setTitle("🆘 Help")
            .setDescription("🌟 Benvenuto nel comando 'help'! Hai bisogno di informazioni su un particolare comando? Clicca su quello di cui hai bisogno e io ti aiuterò! 🚀")
            .setThumbnail(embedconfig.image.help)
    }

    eval() {
        return this.embed
            .setTitle("🤖 Eval")
    }

    registerCommand(status) {

        if (status == 0) {
            this.embed
                .setTitle("Cancellazione Comandi in corso")
                .setDescription("La cancellazione dei comandi è in corso")
                .setThumbnail(embedconfig.image.load)
                .setColor(embedconfig.color.yellow)

        } else if (status == 1) {
            this.embed
                .setTitle("Riscrittura Comandi completata")
                .setDescription("Riscrittura dei comandi completata con successo")
                .setThumbnail(embedconfig.image.success)
                .setColor(embedconfig.color.green)
        } else if (status == -1) {
            this.embed
                .setTitle("Riscrittura Comandi fallita")
                .setDescription("Riscrittura dei comandi fallita")
                .setThumbnail(embedconfig.image.genericerr)
                .setColor(embedconfig.color.red)
        }

        return this.embed

    }

    avatar(member) {
        return this.embed
            .setTitle("🖼️ Avatar")
            .setDescription(`Ecco l'avatar di ${(member.user.globalName ? member.user.globalName : member.user.tag)}`)
            .setImage(member.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
            .setThumbnail(member.guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }



    serverinfo(guild, invites) {

        return this.embed
            .setTitle("ℹ️ Server Info")
            .setDescription(`Ecco le informazioni di ${guild.name}`)
            .addFields(
                {
                    name: "👑 Proprietario",
                    value: guild.members.cache.find(x => x.id == guild.ownerId).user.globalName.toString(),
                    inline: true
                },
                {
                    name: "📅 Creazione",
                    value: guild.createdAt.toDateString(),
                    inline: true
                },
                {
                    name: "🔊 Canali Vocali",
                    value: guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size.toString(),
                    inline: true
                },
                {
                    name: "📝 Canali Testuali",
                    value: guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size.toString(),
                    inline: true
                },
                {
                    name: "👥 Membri",
                    value: guild.memberCount.toString(),
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: guild.members.cache.filter(member => member.user.bot).size.toString(),
                    inline: true
                },
                {
                    name: "🔒 Ruoli",
                    value: guild.roles.cache.size.toString(),
                    inline: true
                },
                {
                    name: "📜 Emotes",
                    value: guild.emojis.cache.size.toString(),
                    inline: true
                },
                {
                    name: "🔗 Invito",
                    value: `[Clicca qui](${invites.toString()})`,
                    inline: true
                },
            )
            .setThumbnail(guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))


    }


    userinfo(member) {
        return this.embed
            .setTitle("👤 User Info")
            .setDescription(`Ecco le informazioni di ${(member.user.globalName ? member.user.globalName : member.user.tag)}`)
            .addFields(
                {
                    name: "📛 Username",
                    value: (member.user.globalName ? member.user.globalName : member.user.tag).toString(),
                    inline: true
                },
                {
                    name: "🔗 Tag",
                    value: member.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: member.user.id.toString(),
                    inline: true
                },
                {
                    name: "📅 Creazione",
                    value: member.user.createdAt.toDateString(),
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: member.user.bot ? "Si" : "No",
                    inline: true
                },
                {
                    name: "🔒 Ruoli",
                    value: member.roles.cache.size.toString(),

                },
                {
                    name: "📅 Entrato",
                    value: member.joinedAt.toDateString(),
                }
            )
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }


    botinfo() {
        return this.embed
            .setTitle("🤖 Bot Info")
            .setDescription(`Ecco le informazioni di ${client.user.username}`)
            .addFields(
                {
                    name: "📛 Tag",
                    value: client.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: client.user.id.toString(),
                    inline: false
                },
                {
                    name: "📅 Creazione",
                    value: " 1, giugno 2022",
                    inline: true
                },
                {
                    name: "🤖 Bot ",
                    value: client.user.bot ? "Si" : "No",
                    inline: true
                },
                {
                    name: "🪙 Repo Github",
                    value: `[Clicca qui](${packagejson.repo.toString()})`,
                    inline: true
                },
            )
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }

    ban(member, reason) {
        return this.embed
            .setTitle("🔨 Ban")
            .setDescription(`L'utente ${member.user.globalName} è stato bannato`)
            .addFields(
                {
                    name: "📛 Username",
                    value: member.user.globalName.toString(),
                    inline: true
                },
                {
                    name: "🔗 Tag",
                    value: member.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: member.user.id.toString(),
                    inline: true
                },
                {
                    name: "🔒 Ruoli",
                    value: member.roles.cache.size.toString(),

                },
                {
                    name: "📅 Entrato",
                    value: member.joinedAt.toDateString(),
                },
                {
                    name: "🔨 Motivo",
                    value: reason.toString(),
                }
            )
            .setThumbnail(embedconfig.image.ban)
    }





}

module.exports = { comandbembed }