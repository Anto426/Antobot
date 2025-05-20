import { ChannelType } from "discord.js";
import SystemCheck from "../client/SystemCheck.js";
import BotConsole from "../console/BotConsole.js";

class Security {
  constructor(interaction, command, owners = [], allowedChannels = []) {
    if (!interaction) throw new Error("Parametro 'interaction' mancante.");
    if (!command) throw new Error("Parametro 'command' mancante.");

    this.interaction = interaction;
    this.command = command;
    this.owners = new Set(owners);
    this.allowedChans = new Set(allowedChannels);
  }

  async _gatherFlags() {
    try {
      const { member, guild, channel, options, client } = this.interaction;
      const target = options.getMember?.("user");

      this.isOwner = this.owners.has(member.id);
      this.isServerOwner = guild.ownerId === member.id;
      this.isBotUser = member.user.bot;
      this.isSelf = target?.id === member.id;
      this.isStaff = this._checkStaff(member, target);

      this.inAllowedChannel =
        this.allowedChans.size === 0 || this.allowedChans.has(channel.id);

      this.voiceChannel = member.voice.channel || null;
      this.botVoiceChannel =
        guild.channels.cache.find(
          (c) =>
            c.type === ChannelType.GuildVoice && c.members.has(client.user.id)
        ) || null;
    } catch (err) {
      BotConsole.error("[Security]._gatherFlags error:", err);
      throw new Error(
        "Errore durante il recupero delle informazioni di sicurezza."
      );
    }
  }

  _checkStaff(member, target) {
    try {
      if (!this.command.permissions?.length) return true;

      const hasPerms = this.command.permissions.every((p) =>
        member.permissions.has(p)
      );
      if (!hasPerms) return false;

      if (target) {
        return (
          member.roles.highest.rawPosition > target.roles.highest.rawPosition
        );
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  async allow() {
    try {
      BotConsole.info(
        `[Security] Verifica permessi per il comando: ${this.command.name}`
      );

      if (this.command.isActive === false) {
        throw new Error("Questo comando non è attualmente attivo.");
      }

      await this._gatherFlags();

      if (this.isBotUser && !this.command.isBotAllowed) {
        throw new Error("Il bot non può eseguire questo comando.");
      }

      if (this.isSelf) {
        throw new Error("Non puoi eseguire il comando su te stesso.");
      }

      if (!this.inAllowedChannel) {
        throw new Error("Comando non permesso in questo canale.");
      }

      if (this.command.isOwnerOnly) {
        if (!this.isOwner) {
          throw new Error("Solo il proprietario può usare questo comando.");
        }
      } else {
        if (!this.isOwner && !this.isServerOwner && !this.isStaff) {
          throw new Error("Non hai i permessi per usare questo comando.");
        }
      }

      if (this.command.requiresPositionArgument) {
        const posArg = this.interaction.options.getInteger("position");
        if (posArg === null || posArg === undefined) {
          throw new Error(
            "È necessario fornire un argomento di posizione valido."
          );
        }
      }

      if (this.command.isTestCommand) {
        if (!this.isOwner) {
          throw new Error("Questo comando è riservato ai test.");
        }
      }

      if (
        SystemCheck.isFeatureEnabled("music") &&
        this.command.moduleTag === "musicCommands"
      ) {
        return await this._checkDistube();
      }

      if (this.interaction.isButton?.()) {
        this._checkButtonUserId();
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  _checkButtonUserId() {
    try {
      const customId = this.interaction.customId;
      if (!customId) return;

      const parts = customId.split("_");
      if (parts.length < 2) return;

      const userIdFromButton = parts[1];
      if (userIdFromButton !== this.interaction.user.id) {
        throw new Error("Non sei autorizzato a usare questo bottone.");
      }
    } catch (err) {
      throw err;
    }
  }

  async _checkDistube() {
    try {
      if (!SystemCheck.isFeatureEnabled("music")) {
        throw new Error("Funzionalità musicale non abilitata.");
      }

      const { member, guild, client } = this.interaction;
      const userChannel = member.voice.channel;
      let botChannel =
        guild.channels.cache.find(
          (c) =>
            c.type === ChannelType.GuildVoice && c.members.has(client.user.id)
        ) || null;

      if (!this.command.disTube) {
        throw new Error("Configurazione di DisTube mancante.");
      }

      if (botChannel) {
        if (
          botChannel.members.size === 1 &&
          botChannel.members.has(client.user.id)
        ) {
          // Se l'utente è in un canale diverso, sposta il bot in quel canale
          if (userChannel && userChannel.id !== botChannel.id) {
            await guild.members.me.voice.setChannel(userChannel.id);
            botChannel = userChannel; // Aggiorna lo stato
          } else {
            // Altrimenti disconnetti il bot se nessun canale valido per muoversi
            await guild.members.me.voice.disconnect();
            botChannel = null;
          }
        }
      }

      const {
        requireUserInVoiceChannel,
        requireSameVoiceChannel,
        requireBotInVoiceChannel,
        requireTrackInQueue,
        requireAdditionalTracks,
        disallowIfPaused,
        disallowIfPlaying,
        requireSeekable,
      } = this.command.disTube;

      if (requireUserInVoiceChannel && !userChannel) {
        throw new Error(
          "Devi essere in un canale vocale per usare questo comando."
        );
      }

      if (requireBotInVoiceChannel && !botChannel) {
        throw new Error(
          "Il bot deve essere in un canale vocale per usare questo comando."
        );
      }

      if (
        requireSameVoiceChannel &&
        botChannel &&
        (!userChannel || userChannel.id !== botChannel.id)
      ) {
        throw new Error("Devi essere nello stesso canale vocale del bot.");
      }

      let queue = null;
      if (
        requireTrackInQueue ||
        requireAdditionalTracks ||
        disallowIfPaused ||
        disallowIfPlaying ||
        requireSeekable
      ) {
        try {
          queue = global.distube.getQueue(this.interaction.guild);
        } catch (e) {
          throw new Error("Impossibile recuperare la coda di riproduzione.");
        }
      }

      if (requireTrackInQueue && !queue) {
        throw new Error("Non ci sono tracce in coda.");
      }

      if (requireAdditionalTracks && (!queue || queue.songs.length < 2)) {
        throw new Error("È necessario avere almeno altre tracce in coda.");
      }

      if (disallowIfPaused && queue?.paused) {
        throw new Error(
          "Comando non permesso quando la riproduzione è in pausa."
        );
      }

      if (disallowIfPlaying && queue && !queue.paused) {
        throw new Error("Comando non permesso durante la riproduzione.");
      }

      if (requireSeekable) {
        const currentSong = queue?.songs?.[0];
        if (!currentSong || !currentSong.isSeekable) {
          throw new Error("La traccia corrente non è seekable.");
        }
      }

      if (!userChannel && !botChannel) {
        throw new Error(
          "Devi essere in un canale vocale per usare questo comando."
        );
      }

      return [userChannel, botChannel];
    } catch (error) {
      throw new Error(error.message || error);
    }
  }
}

export default Security;
