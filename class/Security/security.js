import { ChannelType } from "discord.js";
import SystemCheck from "../client/SystemCheck.js";

class Security {
  constructor(interaction, command, owners = [], allowedChannels = []) {
    if (!interaction) {
      throw new Error("Parametro 'interaction' mancante.");
    }
    if (!command) {
      throw new Error("Parametro 'command' mancante.");
    }

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
      console.error("[Security]._gatherFlags error:", err);
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
      console.error("[Security]._checkStaff error:", err);
      return false;
    }
  }

  async allow() {
    try {
      await this._gatherFlags();

      if (this.isBotUser)
        throw new Error("Il bot non può eseguire questo comando.");
      if (this.isSelf)
        throw new Error("Non puoi eseguire il comando su te stesso.");
      if (!this.inAllowedChannel)
        throw new Error("Comando non permesso in questo canale.");

      if (this.command.OnlyOwner) {
        if (!this.isOwner)
          throw new Error("Solo il proprietario può usare questo comando.");
      } else {
        if (!this.isOwner && !this.isServerOwner && !this.isStaff) {
          throw new Error("Non hai i permessi per usare questo comando.");
        }
      }

      if (
        SystemCheck.isFeatureEnabled("music") &&
        this.command.moduleTag === "musiccommands"
      ) {
        return await this._checkDistube();
      }

      if (this.interaction.isButton?.()) {
        this._checkButtonUserId();
      }

      return true;
    } catch (err) {
      console.error("[Security].allow error:", err);
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
      console.error("[Security]._checkButtonUserId error:", err);
      throw err;
    }
  }

  async _checkDistube() {
    try {
      const { member, guild, client } = this.interaction;
      const userChannel = member.voice.channel;
      const botChannel = guild.channels.cache.find(
        (c) =>
          c.type === ChannelType.GuildVoice && c.members.has(client.user.id)
      );

      if (!this.command.disTube) {
        throw new Error("Configurazione di DisTube mancante.");
      }
      const { checkchannel, checklisttrack } = this.command.disTube;

      if (checkchannel) {
        if (!userChannel) {
          throw new Error(
            "Devi essere in un canale vocale per usare questo comando."
          );
        }
        if (botChannel && userChannel.id !== botChannel.id) {
          throw new Error("Devi essere nello stesso canale vocale del bot.");
        }
      }

      if (checklisttrack) {
        let queue;
        try {
          queue = client.distube.getQueue(this.interaction);
        } catch (e) {
          throw new Error("Impossibile recuperare la coda di riproduzione.");
        }
        if (!queue) {
          throw new Error("Non ci sono tracce in coda.");
        }
      }

      if (!userChannel && !botChannel) {
        throw new Error(
          "Devi essere in un canale vocale per usare questo comando."
        );
      }

      return [userChannel, botChannel];
    } catch (error) {
      console.error("[Security]._checkDistube error:", error);
      throw new Error("Errore durante il controllo della riproduzione vocale.");
    }
  }
}

export default Security;
