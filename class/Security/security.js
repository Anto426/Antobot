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
      `[Security] Verifica dei permessi per il comando: ${this.command.name}`
    );

    if (this.command.isActive === false) {
      throw new Error("Questo comando non è attualmente attivo.");
    }

    this._gatherFlags();

    if (this.isBotUser && !this.command.isBotAllowed) {
      throw new Error("I bot non possono eseguire questo comando.");
    }
    if (this.isSelf) {
      throw new Error("Non puoi usare questo comando su te stesso.");
    }
    if (!this.inAllowedChannel) {
      throw new Error("Questo comando non è consentito in questo canale.");
    }
    if (this.command.isTestCommand && !this.isOwner) {
      throw new Error("Questo è un comando di solo test.");
    }

    const isPrivilegedUser = this.isOwner || this.isServerOwner || this.isStaff;
    if (this.command.isOwnerOnly && !this.isOwner) {
      throw new Error("Solo il proprietario del bot può usare questo comando.");
    }
    if (!this.command.isOwnerOnly && !isPrivilegedUser) {
      throw new Error("Non hai il permesso di usare questo comando.");
    }

    if (
      this.interaction.isButton() ||
      this.interaction.isAnySelectMenu() ||
      this.interaction.isModalSubmit()
    ) {
      this._checkButtonPermissions();
    }

    if (
      SystemCheck.isFeatureEnabled("music") &&
      (this.command.moduleTag === "musicCommands" || this.command.disTube)
    ) {
      return this._checkDistube();
    }

    return true;
  }

  _checkButtonPermissions() {
    const customId = this.interaction.customId;
    const userIdFromButton = customId.split("-")[1];
    if (userIdFromButton && userIdFromButton !== this.interaction.user.id) {
      throw new Error("Non sei autorizzato a usare questo pulsante.");
    }
  }

  async _checkDistube() {
    if (!this.command.disTube) {
      throw new Error(
        "La configurazione di DisTube è mancante per questo comando."
      );
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
      throw new Error(
        "Devi essere in un canale vocale per usare questo comando."
      );
    }
    if (requireBotInVoiceChannel && !botChannel) {
      throw new Error(
        "Il bot deve essere in un canale vocale per questo comando."
      );
    }
    if (
      requireSameVoiceChannel &&
      userChannel &&
      botChannel &&
      userChannel?.id !== botChannel?.id
    ) {
      throw new Error("Devi essere nello stesso canale vocale del bot.");
    }
    if (requireTrackInQueue && !queue) {
      throw new Error("Non ci sono brani in coda.");
    }
    if (requireAdditionalTracks && (!queue || queue.songs.length < 2)) {
      throw new Error("Deve esserci almeno un altro brano in coda.");
    }
    if (disallowIfPaused && queue?.paused) {
      throw new Error(
        "Comando non consentito mentre la riproduzione è in pausa."
      );
    }
    if (disallowIfPlaying && queue && !queue.paused) {
      throw new Error("Comando non consentito durante la riproduzione.");
    }
    if (requireSeekable && !queue?.songs[0]?.isSeekable) {
      throw new Error("Il brano corrente non è ricercabile.");
    }

    return [userChannel, botChannel];
  }
}

export default Security;
