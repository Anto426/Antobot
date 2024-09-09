const { Time } = require("../../function/time/time");
const { BaseEmbed } = require("../baseembed");

class logembed extends BaseEmbed {
    constructor(guild, member) {
        super(guild, member);
        this.package = require("../../package.json");
        this.Time = new Time();

    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.orange); resolve(0); }).catch(() => { reject(-1); });
        });

    }


    addchannel(channel) {
        return this.embed
            .setTitle("📢 Nuovo canale creato")
            .setDescription(`Il canale ${channel} è stato creato`)
            .addFields(
                {
                    name: "📢 Nome",
                    value: channel.name.toString(),
                    inline: true
                },
                {
                    name: "🔗 Tipo",
                    value: channel.type == 0 ? "Testuale" : channel.type == 2 ? "Voce" : "Categoria",
                    inline: true
                },
            )
            .setThumbnail(channel.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.green)
    }

    deletechannel(channel) {
        return this.embed
            .setTitle("🗑️ Canale eliminato")
            .setDescription(`Il canale ${channel.name} è stato eliminato`)
            .addFields(
                {
                    name: "📢 Nome",
                    value: channel.name.toString(),
                    inline: true
                },
                {
                    name: "🔗 Tipo",
                    value: channel.type == 0 ? "Testuale" : channel.type == 2 ? "Voce" : "Categoria",
                    inline: true
                },
            )
            .setThumbnail(channel.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.red)
    }

    updatechannel(newChannel, changedprop) {
        return this.embed
            .setTitle("✏️ Canale modificato")
            .setDescription(`Il canale ${newChannel.name} è stato modificato`)
            .addFields({
                name: "🔧 Proprietà modificate",
                value: changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n")
            })
            .setThumbnail(newChannel.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
            
    }


    emojiCreate(emoji) {
        return this.embed
            .setTitle("🎨 Nuova emoji creata")
            .setDescription(`La nuova emoji ${emoji} è stata creata`)
            .setThumbnail(emoji.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.green)
    }


    emojiDelete(emoji) {
        return this.embed
            .setTitle("🗑️ Emoji eliminata")
            .setDescription(`L'emoji ${emoji} è stata eliminata`)
            .setThumbnail(emoji.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.red)
    }



    emojiUpdate(oldEmoji, newEmoji) {
        return this.embed
            .setTitle("✏️ Emoji modificata")
            .setDescription(`L'emoji ${oldEmoji} è stata modificata in ${newEmoji}`)
            .setThumbnail(oldEmoji.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
    }


    guildBanAdd(guildban) {
        return this.embed
            .setTitle("🔨 Utente bannato")
            .setDescription(`L'utente ${guildban.user.globalName ? guildban.user.globalName : guildban.user.tag} è stato bannato`)
            .addFields(
                {
                    name: "🔨 Motivo",
                    value: guildban.reason ? guildban.reason : "Non specificato",
                }
            )
            .setThumbnail(guildban.user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.red)
    }

    guildBanRemove(user) {
        return this.embed
            .setTitle("🔨 Utente sbannato")
            .setDescription(`L'utente ${user.globalName ? user.globalName : user.tag} è stato sbannato`)
            .setThumbnail(user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.green)
    }


    guildMemberUpdate(member, changedprop) {
        return this.embed
            .setTitle("✏️ Utente modificato")
            .setDescription(`L'utente ${member.user.globalName ? member.user.globalName : member.user.tag} è stato modificato`)
            .addFields({
                name: "🔧 Proprietà modificate",
                value: changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n")
            })
            .setThumbnail(member.user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
    }


    guildUpdate(newGuild, changedprop) {
        return this.embed
            .setTitle("✏️ Server modificato")
            .setDescription(`Il server ${newGuild.name} è stato modificato`)
            .addFields({
                name: "🔧 Proprietà modificate",
                value: changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n")
            })
            .setThumbnail(newGuild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
    }


    inviteCreate(invite) {
        return this.embed
            .setTitle("🔗 Invito creato")
            .setDescription(`Il nuovo invito ${invite} è stato creato`)
            .addFields(
                {
                    name: "🔗 Creatore",
                    value: `${invite.inviter.globalName ? invite.inviter.globalName : invite.inviter.tag}`,
                    inline: true
                },
                {
                    name: "🔗 Usi",
                    value: invite.uses ? invite.uses.toString() : "0",
                    inline: true
                },
                {
                    name: "🔗 Scadenza",
                    value: invite.expiresAt ? invite.expiresAt.toString() : "Mai",
                    inline: true
                }
            )
            .setThumbnail(invite.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.green)
    }


    inviteDelete(invite) {
        return this.embed
            .setTitle("🔗 Invito eliminato")
            .setDescription(`L'invito ${invite} è stato eliminato`)
            .addFields(
                {
                    name: "🔗 Usi",
                    value: invite.uses ? invite.uses.toString() : "0",
                    inline: true
                },
                {
                    name: "🔗 Scadenza",
                    value: invite.expiresAt ? invite.expiresAt.toString() : "Mai",
                    inline: true
                }
            )
            .setThumbnail(invite.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.red)
    }

    ready() {
        return this.embed
            .setTitle("🟢 Bot pronto")
            .setDescription(`il bot si è avviato correttamente`)
            .addFields(
                {
                    name: "📜 N comandi di base caricati",
                    value: `${client.basecommands.size.toString()}`,
                },
                {
                    name: "🎵 N comandi di distube caricati",
                    value: `${client.distubecommands.size.toString()}`,
                },
                {
                    name: "📅 N Eventi caricati di base",
                    value: `${client.baseevents.size.toString()}`,
                },
                {
                    name: "🎶 N Eventi caricati di ditube",
                    value: `${client.distubeevents.size.toString()}`,
                },
                {
                    name: "🔧 Nome",
                    value: `${this.package.name}`,
                    inline: true
                },
                {
                    name: "🔧 Versione",
                    value: `${this.package.version}`,
                    inline: true
                },
                {
                    name: "🔧 Sviluppatore",
                    value: `${this.package.author}`,
                    inline: true
                },
                {
                    name: "🔧 Repo",
                    value: ` [clicca qui](${this.package.repo})`
                },

            )
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))

            .setColor(embedconfig.color.green)

    }

    roleCreate(role) {
        return this.embed
            .setTitle("🔧 Nuovo ruolo creato")
            .setDescription(`Il nuovo ruolo ${role} è stato creato`)
            .addFields(
                {
                    name: "🔧 Nome",
                    value: role.name.toString(),
                    inline: true
                },
                {
                    name: "🔧 Colore",
                    value: role.hexColor.toString(),
                    inline: true
                },
                {
                    name: "🔧 Posizione",
                    value: role.position.toString(),
                    inline: true
                }
            )
            .setThumbnail(role.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.green)
    }


    roleDelete(role) {
        return this.embed
            .setTitle("🔧 Ruolo eliminato")
            .setDescription(`Il ruolo ${role} è stato eliminato`)
            .addFields(
                {
                    name: "🔧 Nome",
                    value: role.name.toString(),
                    inline: true
                },
                {
                    name: "🔧 Colore",
                    value: role.hexColor.toString(),
                    inline: true
                },
                {
                    name: "🔧 Posizione",
                    value: role.position.toString(),
                    inline: true
                }
            )
            .setThumbnail(role.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

            .setColor(embedconfig.color.red)
    }


    roleUpdate(oldRole, changedprop) {
        return this.embed
            .setTitle("🔧 Ruolo modificato")
            .setDescription(`Il ruolo ${oldRole.name} è stato modificato`)
            .addFields({
                name: "🔧 Proprietà modificate",
                value: changedprop.map((prop) => { return `**${prop.key}** da ${prop.old} a ${prop.new}` }).join("\n")
            })
            .setThumbnail(oldRole.guild.iconURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))

    }


    guildMemberAdd(member) {
        return this.embed
            .setTitle("👥 Nuovo membro")
            .setDescription(`Benvenuto ${member.user.globalName ? member.user.globalName : member.user.tag} nel server`)
            .addFields(
                {
                    name: "👥 Nome",
                    value: member.user.globalName ? member.user.globalName.toString() : member.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: member.user.id.toString(),
                    inline: true
                },
            )
            .setThumbnail(member.user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
            .setColor(embedconfig.color.green)
    }

    guildMemberAddReturn(member, rolenamelist) {
        return this.embed
            .setTitle("👥 Membro ritornato")
            .setDescription(`Bentornato ${member.user.globalName ? member.user.globalName : member.user.tag} nel server`)
            .addFields(
                {
                    name: "👥 Nome",
                    value: member.user.globalName ? member.user.globalName.toString() : member.user.tag.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID",
                    value: member.user.id.toString(),
                    inline: true
                },
                {
                    name: "🎭 Ruoli ricevuti",
                    value: rolenamelist.join("\n")
                }
            )
            .setThumbnail(member.user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
            .setColor(embedconfig.color.green)
    }


    guildMemberRemove(member) {
        return this.embed
            .setTitle("👥 Membro uscito")
            .setDescription(`L'utente ${member.user.globalName ? member.user.globalName : member.user.tag} ha lasciato il server`)
            .addFields(
                {
                    name: "👥 Nome",
                    value: member.user.globalName ? member.user.globalName : member.user.tag,
                    inline: true
                },
                {
                    name: "👥 ID",
                    value: member.id,
                    inline: true
                },
                {
                    name: "👥 Data di entrata",
                    value: this.Time.formatDate(member.joinedAt).toString(),
                    inline: true
                }
            )
            .setThumbnail(member.user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
            .setColor(embedconfig.color.red)
    }

    voiceEnter(user, channel) {
        return this.embed
            .setTitle("🎙️ Entrata in chat vocale")
            .setDescription(`L'utente ${user.globalName ? user.globalName : user.tag} è entrato nel canale vocale ${channel.name}`)
            .addFields(
                {
                    name: "🎙️ Nuova chat vocale",
                    value: channel.name.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID chat vocale",
                    value: channel.id.toString(),
                    inline: true
                },
                {
                    name: "👥 Utenti chat vocale",
                    value: channel.members.size.toString(),
                    inline: true
                }
            )
            .setThumbnail(user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
            .setColor(embedconfig.color.green)
    }

    voiceExit(user, channel) {
        return this.embed
            .setTitle("🎙️ Uscita dalla chat vocale")
            .setDescription(`L'utente ${user.globalName ? user.globalName : user.tag} è uscito dal canale vocale ${channel.name}`)
            .addFields(
                {
                    name: "🎙️ Nuova chat vocale",
                    value: channel.name.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID chat vocale",
                    value: channel.id.toString(),
                    inline: true
                },
                {
                    name: "👥 Utenti chat vocale",
                    value: channel.members.size.toString(),
                    inline: true
                }
            )
            .setThumbnail(user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
            .setColor(embedconfig.color.red)
    }


    voiceChange(user, channel) {
        return this.embed
            .setTitle("🎙️ Cambio chat vocale")
            .setDescription(`L'utente ${user.globalName ? user.globalName : user.tag} è passato dal canale vocale ${channel.name}`)
            .addFields(
                {
                    name: "🎙️ Nuova chat vocale",
                    value: channel.name.toString(),
                    inline: true
                },
                {
                    name: "🆔 ID chat vocale",
                    value: channel.id.toString(),
                    inline: true
                },
                {
                    name: "👥 Utenti chat vocale",
                    value: channel.members.size.toString(),
                    inline: true
                }
            )
            .setThumbnail(user.avatarURL(
                {
                    dynamic: true,
                    size: 256
                }
            ))
    }


    guildMemberAddBot(member) {
        return this.embed
        .setTitle("🤖 Nuovo bot aggiunto")
        .setDescription(`Nuovo bot aggiunto al server`)
        .addFields(
            {
                name: "🤖 Nome",
                value: member.user.globalName ? member.user.globalName : member.user.tag,
                inline: true
            },
            {
                name: "🤖 ID",
                value: member.user.id,
                inline: true
            },
            {
                name: "🤖 Data di entrata",
                value: this.Time.formatDate(member.joinedAt),
                inline: true
            },
            {
                name: "Invitato da",
                value: member.inviter ? member.inviter.tag : "Non specificato",
            }
        )
    }

    guildMemberRemoveBot(member) {
        return this.embed
        .setTitle("🤖 Bot rimosso")
        .setDescription(`Bot rimosso dal server`)
        .addFields(
            {
                name: "🤖 Nome",
                value: member.user.globalName ? member.user.globalName : member.user.tag,
                inline: true
            },
            {
                name: "🤖 ID",
                value: member.user.id,
                inline: true
            },
            {
                name: "🤖 Data di entrata",
                value: this.Time.formatDate(member.joinedAt),
                inline: true
            }
        )
    }


}

module.exports = { logembed };