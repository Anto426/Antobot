const { BaseEmbed } = require("../baseembed");
const packagejson = require("../../package.json");
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
                .setThumbnail(embedconfig.image.genericerror)
                .setColor(embedconfig.color.red)
        }

        return this.embed

    }

    avatar(user) {
        return this.embed
            .setTitle("🖼️ Avatar")
            .setDescription(`Ecco l'avatar di ${user.username}`)
            .setImage(user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
            .setThumbnail(user.guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }



    serverinfo(guild) {
        return this.embed
            .setTitle("ℹ️ Server Info")
            .setDescription(`Ecco le informazioni di ${guild.name}`)
            .addFields(
                {
                    name: "👑 Proprietario",
                    value: guild.owner.user.tag,
                    inline: true
                },
                {
                    name: "📅 Creazione",
                    value: guild.createdAt.toDateString(),
                    inline: true
                },
                {
                    name: "🌍 Regione",
                    value: guild.region,
                    inline: true
                },
                {
                    name: "🔊 Canali Vocali",
                    value: guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size,
                    inline: true
                },
                {
                    name: "📝 Canali Testuali",
                    value: guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size,
                    inline: true
                },
                {
                    name: "👥 Membri",
                    value: guild.memberCount,
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: guild.members.cache.filter(member => member.user.bot).size,
                    inline: true
                },
                {
                    name: "🔒 Ruoli",
                    value: guild.roles.cache.size,
                    inline: true
                },
                {
                    name: "📜 Emotes",
                    value: guild.emojis.cache.size,
                    inline: true
                },
                {
                    name: "🔗 Invito",
                    value: `[Clicca qui](${guild.vanityURLCode})`,
                    inline: true
                },
            )
            .setThumbnail(guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }


    userinfo(user) {
        return this.embed
            .setTitle("👤 User Info")
            .setDescription(`Ecco le informazioni di ${user.username}`)
            .addFields(
                {
                    name: "📛 Tag",
                    value: user.tag,
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: user.id,
                    inline: true
                },
                {
                    name: "📅 Creazione",
                    value: user.createdAt.toDateString(),
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: user.bot,
                    inline: true
                },
                {
                    name: "📅 Entrato",
                    value: user.joinedAt.toDateString(),
                    inline: true
                }
            )
            .setThumbnail(user.displayAvatarURL({
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
                    value: client.user.tag,
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: client.user.id,
                    inline: true
                },
                {
                    name: "📅 Creazione",
                    value: client.user.createdAt.toDateString(),
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: client.user.bot,
                    inline: true
                },
                {
                    name: "Repo Github",
                    value: `[Clicca qui](${packagejson.repository.url})`,
                    inline: true
                },
            )
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }


    userbanner(user) {
        return this.embed
            .setTitle("🖼️ Banner")
            .setDescription(`Ecco il banner di ${user.username}`)
            .setImage(user.bannerURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
            .setThumbnail(user.guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }





}

module.exports = { comandbembed }