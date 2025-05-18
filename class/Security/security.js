import { ChannelType } from "discord.js";
import SystemCheck from "../client/SystemCheck.js";

class Security {
  constructor(interaction, command, owners = [], allowedChannels = []) {
    this.interaction = interaction;
    this.command = command;
    this.owners = new Set(owners);
    this.allowedChans = new Set(allowedChannels);
  }

  async _gatherFlags() {
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
  }

  _checkStaff(member, target) {
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
  }

  async allow() {
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
  }

  _checkButtonUserId() {
    const customId = this.interaction.customId;
    if (!customId) return;

    const parts = customId.split("_");
    if (parts.length < 2) return;

    const userIdFromButton = parts[1];

    if (userIdFromButton !== this.interaction.user.id) {
      throw new Error("Non sei autorizzato a usare questo bottone.");
    }
  }

  async _checkDistube() {
    const { member, guild, client } = this.interaction;
    const userChannel = member.voice.channel;
    const botChannel = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildVoice && c.members.has(client.user.id)
    );

    if (this.command.disTube.checkchannel) {
      if (!userChannel) {
        throw new Error(
          "Devi essere in un canale vocale per usare questo comando."
        );
      }
      if (botChannel && userChannel.id !== botChannel.id) {
        throw new Error("Devi essere nello stesso canale vocale del bot.");
      }
    }

    if (this.command.disTube.checklisttrack) {
      const queue = client.distube.getQueue(this.interaction);
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
  }
}

export default Security;
