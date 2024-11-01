const { BaseEmbed } = require("../baseembed");
const packagejson = require("../../package.json");
const { ChannelType } = require("discord.js");
const { Time } = require("../../function/time/time");
class comandbembed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member)
        this.packagejson = require("../../package.json")
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; resolve(0) }).catch(() => { reject(-1) })
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
            .addFields(
                {
                    name: "📜 N Comandi Tot",
                    value: client.commandg.size.toString(),
                },
                {
                    name: "📜 N Comandi Base",
                    value: client.basecommands.size.toString(),
                },
                {
                    name: "🎵 N Comandi Distube",
                    value: client.distubecommands ? client.distubecommands.size.toString() : "Client off",
                },
            )
            .setThumbnail(embedconfig.image.help)

    }

    eval() {
        return this.embed
            .setTitle("🤖 Eval")
    }

    registerCommand(status) {

        if (status == 0) {
            this.embed
                .setTitle("🔄 Riscrittura Comandi in corso")
                .setDescription("⏳ La Riscrittura dei comandi è in corso")
                .setThumbnail(embedconfig.image.load)
                .setColor(embedconfig.color.yellow)

        } else if (status == 1) {
            this.embed
                .setTitle("✅ Riscrittura Comandi completata")
                .setDescription("🎉 Riscrittura dei comandi completata con successo")
                .setThumbnail(embedconfig.image.success)
                .setColor(embedconfig.color.green)
        } else if (status == -1) {
            this.embed
                .setTitle("⚠️ Riscrittura Comandi Completata con errori")
                .setDescription("❗ Riscrittura dei comandi completata con errori")
                .setThumbnail(embedconfig.image.genericerr)
                .setColor(embedconfig.color.yellow)
        } else if (status == -2) {
            this.embed
                .setTitle("❌ Riscrittura Comandi fallita")
                .setDescription("💥 Riscrittura dei comandi fallita")
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
            .setDescription(`📋 Ecco le informazioni di ${guild.name}`)
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
                    name: "📜 Comandi Totali",
                    value: client.commandg.size.toString(),
                    inline: true
                },
                {
                    name: "📜 N Comandi Base",
                    value: client.basecommands.size.toString(),
                    inline: true
                },
                {
                    name: "🎵 N Comandi Distube",
                    value: client.distubecommands ? client.distubecommands.size.toString() : "Client off",
                    inline: true
                },
                {
                    name: "📅 N Eventi Totali",
                    value: (client.baseevents.size + client.distubeevents.size).toString(),
                    inline: true
                },
                {
                    name: "📅 N Eventi Base",
                    value: client.baseevents.size.toString(),
                    inline: true
                },
                {
                    name: "🎶 N Eventi Distube",
                    value: client.distubeevents ? client.distubeevents.size.toString() : "Client off",
                    inline: true
                },
                {
                    name: "🔖 Versione",
                    value: packagejson.version.toString(),
                    inline: true
                },
                {
                    name: "📛 Tag",
                    value: client.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: client.user.id.toString(),
                    inline: true
                },
                {
                    name: "📅 Creazione",
                    value: "1, giugno 2022",
                    inline: true
                },
                {
                    name: "🔗 Sviluppatore",
                    value: "👑 " + packagejson.author.toString(),
                    inline: true
                },
                {
                    name: "🪙 Repo Github",
                    value: `[Clicca qui](${packagejson.repo.toString()})`,
                    inline: true
                }
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
                    value: member.user.globalName ? member.user.globalName.toString() : member.user.tag.toString(),
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
                },
                {
                    name: "🔒 Ruoli",
                    value: member.roles.cache.size.toString(),

                },
                {
                    name: "🔨 Motivo",
                    value: reason.toString(),
                }
            )
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }


    kick(member, reason) {
        return this.embed
            .setTitle("👢 Kick")
            .setDescription(`L'utente ${member.user.globalName} è stato kikkato`)
            .addFields(
                {
                    name: "📛 Username",
                    value: member.user.globalName ? member.user.globalName.toString() : member.user.tag.toString(),
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
                },
                {
                    name: "🔒 Ruoli",
                    value: member.roles.cache.size.toString(),

                },
                {
                    name: "👢 Motivo",
                    value: reason.toString(),
                }
            )
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }


    timeout(member, time, reason) {
        return this.embed
            .setTitle("⏲️ Timeout")
            .setDescription(`L'utente ${member.user.globalName} è stato timeoutato`)
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
                },
                {
                    name: "🔒 Ruoli",
                    value: member.roles.cache.size.toString(),

                },
                {
                    name: "⏲️ Durata",
                    value: new Time().fortmatTimestamp(time),
                    inline: true
                },
                {
                    name: "👢 Motivo",
                    value: reason.toString(),
                }
            )
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }

    untimeout(member) {
        return this.embed
            .setTitle("🔓 Untimeout")
            .setDescription(`L'utente ${member.user.globalName} è stato untimeoutato`)
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
                },
                {
                    name: "🔒 Ruoli",
                    value: member.roles.cache.size.toString(),

                },
                {
                    name: "⏲️ Timeout annulato",
                    value: new Time().fortmatTimestamp(member.communicationDisabledUntilTimestamp),
                    inline: true
                }
            )
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }


    notbanlist() {
        return this.embed
            .setTitle("🚫 Banlist vuota")
            .setDescription("La banlist è vuota")
            .setThumbnail(embedconfig.image.genericerr)
    }


    unbanlist(size) {
        return this.embed
            .setTitle("Lista Utenti Bannati")
            .setDescription(`Ecco la lista degli utenti bannati Seleziona l'utente da sbannare:`)
            .addFields(
                {
                    name: "🔗 N Utenti Bannati",
                    value: size.toString(),
                    inline: true
                }
            )
            .setThumbnail(embedconfig.image.load)
    }

    unban(member) {
        return this.embed
            .setTitle("🔓 Unban")
            .setDescription(`L'utente ${member.user.globalName ? member.user.globalName : member.user.tag} è stato sbannato`)
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
                }
            )
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
    }

    eval(result) {
        return this.embed
            .setTitle("🤖 Eval")
            .setDescription("Ecco il risultato del comando")
            .addFields(
                {
                    name: "📜 Output",
                    value: `\`\`\`${result}\`\`\``,
                    inline: false
                }
            )
    }

    clear(amount) {
        return this.embed
            .setTitle("🧹 Clear")
            .setDescription(`Ho cancellato ${amount} messaggi`)
            .setThumbnail(embedconfig.image.success)
    }


    githubcreator(data) {
        return this.embed
            .setTitle("👑 Sviluppatore")
            .setDescription(`Ecco le informazioni sullo sviluppatore`)
            .addFields(
                {
                    name: "📛 Username",
                    value: data.name.toString(),
                    inline: true
                },
                {
                    name: "🔗 Tag",
                    value: data.login.toString(),
                    inline: true
                },
                {
                    name: "📝 Bio",
                    value: data.bio.toString(),
                },
                {
                    name: "🔗 Profilo",
                    value: `[Clicca qui](${data.html_url.toString()})`,
                    inline: true
                },
                {
                    name: "📜 Public Repos",
                    value: data.public_repos.toString(),
                    inline: true
                },
                {
                    name: "❌ X account",
                    value: `[Clicca qui](https://x.com/${data.twitter_username.toString()})`,
                    inline: true
                }

            )
            .setThumbnail(data.avatar_url)

    }


    confirmedBan(member) {
        return this.embed
            .setTitle(`Stai per Sbannare ${member.user.globalName ? member.user.globalName : member.user.tag}`)
            .setDescription(`Sicuro di voler sbannare ${member.user.globalName ? member.user.globalName : member.user.tag} `)
            .addFields(
                {
                    name: "👤 Nome",
                    value: member.user.globalName ? member.user.globalName.toString() : member.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: member.user.id.toString(),
                    inline: true
                },
                {
                    name: "📅 Creato il",
                    value: member.user.createdAt.toDateString(),
                    inline: true
                },
                {
                    name: "📝 Motivo",
                    value: member.reason ? member.reason.toString() : "Non specificato",
                    inline: true
                }
            )
            .setThumbnail(member.user.displayAvatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
    }


    commandInformation(command, data) {
        return this.embed
            .setTitle(`${data.command[command.name].emoji}  ${command.name}`)
            .setColor(embedconfig.color.green)
            .setDescription(data.command[command.name].description)
            .setThumbnail(data.command[command.name].image)
            .addFields(
                {
                    name: "🔑 Permessi",
                    value: (command.permisions.length == 0 && !command.OnlyOwner) ? "🔓Libero" : "🔐Bloccato",
                    inline: true
                },
                {
                    name: "🌐 Libero su tutti i canali",
                    value: command.allowedchannels ? "⚔️No" : "🏇Si",
                    inline: true
                },
                {
                    name: "🤖 Appartenente al client",
                    value: `🤖${command.type}`,
                    inline: true
                },
                {
                    name: "📋 Option",
                    value: command.data.options ? command.data.options.map(x => { return `📛 Nome: ${x.name.charAt(0).toUpperCase() + x.name.slice(1)} 📝 Descrizione: ${x.description.charAt(0).toUpperCase() + x.description.slice(1)}` }).join("\n") : "📋 Non ci sono opzioni per questo comando",
                }
            )
    }


    intitguild(guild) {
        return this.embed
            .setTitle("� Inizializzazione del Server")
            .setDescription(`🔧 Inizializzazione del server **${guild.name}**`)
            .setThumbnail(guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
            .setColor("#00FF00")
            .addFields(
                {
                    name: "📅 Data di Creazione",
                    value: guild.createdAt.toDateString(),
                },
                {
                    name: "👑 Proprietario",
                    value: `<@${guild.ownerId}>`,
                }
            );
    }

    setchannelAllow(pageNumber) {
        return this.embed
            .setTitle(`📜 Configurazione Canali | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona i canali in cui il bot può eseguire i comandi.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    SetRulechannel(pageNumber) {
        return this.embed
            .setTitle(`📜 Configurazione canale delle regole | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il canale delle regole.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    SetAnnuncechannel(pageNumber) {
        return this.embed
            .setTitle(`📜 Configurazione canale degli annunci. | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il canale degli annunci.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    SetWelcomechannel(pageNumber) {
        return this.embed
            .setTitle(`📜 Configurazione canale di benvenuto. | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il canale di benvenuto.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    SetBoosterchannel(pageNumber) {
        return this.embed
            .setTitle(`📜 Configurazione canale dei boost | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il canale dei boost.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    SetLogchannel(pageNumber) {
        return this.embed
            .setTitle(`📜 Configurazione canale dei log | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il canale dei log.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    SetDefaultRole(pageNumber) {
        return this.embed
            .setTitle(`🎭 Configurazione ruolo di default | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il ruolo di default.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#0000FF")
    }

    SetBotRole(pageNumber) {
        return this.embed
            .setTitle(`🎭 Configurazione ruolo del bot | Pagina ${pageNumber}`)
            .setDescription("📋 Seleziona il ruolo del bot.")
            .setThumbnail(embedconfig.image.load)
            .setColor("#0000FF")
    }

    AllowHollyday() {
        return this.embed
            .setTitle(`📦 Modulo della festività`)
            .setDescription("❓ Vuoi abilitare il modulo della festività?")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }

    AllowTempChannel() {
        return this.embed
            .setTitle(`📦 Modulo Canali temporanei`)
            .setDescription("❓ Vuoi abilitare i canali temporanei?")
            .setThumbnail(embedconfig.image.load)
            .setColor("#FFA500")
    }


    ConfirmGuildConfig(guild, allowcommandchennelname, roleChannel, annunceChannel, welcomeChannel, userroledefault, botroledefault, hollyday, tempchannel, logchannel, boosterchannel) {
        return this.embed
            .setTitle(`📦 Conferma Configurazione`)
            .setDescription("🔧 Conferma la configurazione per " + guild.name)
            .setThumbnail(guild.iconURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
            .setColor("#FFA500")
            .addFields(
                {
                    name: "📜 Canali Comandi",
                    value: allowcommandchennelname,
                },
                {
                    name: "📜 Canale Regole",
                    value: roleChannel,
                },
                {
                    name: "📢 Canale Annunci",
                    value: annunceChannel,
                },
                {
                    name: "👋 Canale Benvenuto",
                    value: welcomeChannel,
                },
                {
                    name: "💎 Canale Boost",
                    value: boosterchannel,
                },
                {
                    name: "📜 Canale Log",
                    value: logchannel,
                },
                {
                    name: "👤 Ruolo Utente Default",
                    value: userroledefault,
                },
                {
                    name: "🤖 Ruolo Bot Default",
                    value: botroledefault,
                },
                {
                    name: "🎉 Moduolo Festività",
                    value: hollyday,
                },
                {
                    name: "⏳ Moduolo Canali Temporanei",
                    value: tempchannel,
                }
            );
    }

    annunce(message, everyone, thumbnail, image, color) {
        this.embed
            .setTitle("📢 Annuncio")
            .setDescription(`📢 ${everyone}\n${message}`)

        if (thumbnail) {
            this.embed.setThumbnail(thumbnail)
        }

        if (image) {
            this.embed.setImage(image)
        }

        if (color) {
            this.embed.setColor(color)
        }

        return this.embed
    }
}

module.exports = { comandbembed }