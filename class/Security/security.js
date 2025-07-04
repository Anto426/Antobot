import { ChannelType } from "discord.js";
import SystemCheck from "../client/SystemCheck.js";
import BotConsole from "../console/BotConsole.js";

class Security {
  constructor(interaction, command, owners = [], allowedChannels = []) {
    if (!interaction || !interaction.member || !interaction.guild) {
      throw new Error("A valid 'interaction' object is required.");
    }
    if (!command || typeof command !== "object") {
      throw new Error("A valid 'command' object is required.");
    }

    this.interaction = interaction;
    this.command = command;
    this.owners = new Set(owners);
    this.allowedChans = new Set(allowedChannels);

    this.isOwner = null;
    this.isServerOwner = null;
    this.isBotUser = null;
    this.isSelf = null;
    this.isStaff = null;
    this.inAllowedChannel = null;
  }

  _gatherFlags() {
    const { member, guild, channel, options } = this.interaction;
    const target = options?.getMember?.("user");

    this.isOwner = this.owners.has(member.id);
    this.isServerOwner = guild.ownerId === member.id;
    this.isBotUser = member.user.bot;
    this.isSelf = target?.id === member.id;
    this.isStaff = this._checkStaff(member, target);
    this.inAllowedChannel =
      this.allowedChans.size === 0 || this.allowedChans.has(channel.id);
  }

  _checkStaff(member, target) {
    if (!this.command.permissions?.length) {
      return true;
    }

    const hasPerms = this.command.permissions.every((p) =>
      member.permissions.has(p)
    );
    if (!hasPerms) {
      return false;
    }

    if (target) {
      return member.roles.highest.position > target.roles.highest.position;
    }

    return true;
  }

  async allow() {
    BotConsole.info(
      `[Security] Verifying permissions for command: ${this.command.name}`
    );

    if (this.command.isActive === false) {
      throw new Error("This command is not currently active.");
    }

    this._gatherFlags();

    if (this.isBotUser && !this.command.isBotAllowed) {
      throw new Error("Bots cannot execute this command.");
    }
    if (this.isSelf) {
      throw new Error("You cannot use this command on yourself.");
    }
    if (!this.inAllowedChannel) {
      throw new Error("This command is not allowed in this channel.");
    }
    if (this.command.isTestCommand && !this.isOwner) {
      throw new Error("This is a test-only command.");
    }

    const isPrivilegedUser = this.isOwner || this.isServerOwner || this.isStaff;
    if (this.command.isOwnerOnly && !this.isOwner) {
      throw new Error("Only the bot owner can use this command.");
    }
    if (!this.command.isOwnerOnly && !isPrivilegedUser) {
      throw new Error("You do not have permission to use this command.");
    }

    if (this.interaction.isButton()) {
      this._checkButtonPermissions();
    }

    if (
      SystemCheck.isFeatureEnabled("music") &&
      this.command.moduleTag === "musicCommands"
    ) {
      return this._checkDistube();
    }

    return true;
  }

  _checkButtonPermissions() {
    const customId = this.interaction.customId;
    const userIdFromButton = customId.split("-")[1];
    if (userIdFromButton && userIdFromButton !== this.interaction.user.id) {
      throw new Error("You are not authorized to use this button.");
    }
  }

  async _checkDistube() {
    if (!this.command.disTube) {
      throw new Error("DisTube configuration is missing for this command.");
    }

    const { member, guild } = this.interaction;
    const userChannel = member.voice.channel;
    const botChannel = guild.members.me?.voice.channel;
    const queue = global.distube?.getQueue(guild);

    const {
      requireUserInVoiceChannel,
      requireBotInVoiceChannel,
      requireSameVoiceChannel,
      requireTrackInQueue,
      requireAdditionalTracks,
      disallowIfPaused,
      disallowIfPlaying,
      requireSeekable,
    } = this.command.disTube;

    if (requireUserInVoiceChannel && !userChannel) {
      throw new Error("You must be in a voice channel to use this command.");
    }
    if (requireBotInVoiceChannel && !botChannel) {
      throw new Error("The bot must be in a voice channel for this command.");
    }
    if (requireSameVoiceChannel && userChannel && botChannel && userChannel?.id !== botChannel?.id) {
      throw new Error("You must be in the same voice channel as the bot.");
    }
    if (requireTrackInQueue && !queue) {
      throw new Error("There are no tracks in the queue.");
    }
    if (requireAdditionalTracks && (!queue || queue.songs.length < 2)) {
      throw new Error("There must be at least one more track in the queue.");
    }
    if (disallowIfPaused && queue?.paused) {
      throw new Error("Command not allowed while playback is paused.");
    }
    if (disallowIfPlaying && queue && !queue.paused) {
      throw new Error("Command not allowed during playback.");
    }
    if (requireSeekable && !queue?.songs[0]?.isSeekable) {
      throw new Error("The current track is not seekable.");
    }

    return [userChannel, botChannel];
  }
}

export default Security;
