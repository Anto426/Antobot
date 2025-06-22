import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/Sql/SqlManager.js";
import { Events, ChannelType, PermissionsBitField } from "discord.js";

// Usiamo una Map per tenere traccia dei timer di cancellazione attivi.
// Chiave: channelId, Valore: TimeoutID di setTimeout
const pendingDeletions = new Map();

export default {
  name: "PersonalVoiceChannelManager",
  eventType: Events.VoiceStateUpdate,
  isActive: true,

  async execute(oldState, newState) {
    if (
      newState.member?.user.bot ||
      oldState.channelId === newState.channelId
    ) {
      return;
    }

    // Gestisce l'ingresso in un canale (creazione o riutilizzo)
    if (newState.channelId) {
      await this.handleChannelJoin(newState);
    }

    // Gestisce l'uscita da un canale (avvio timer di cancellazione)
    if (oldState.channelId) {
      await this.handleChannelLeave(oldState);
    }
  },

  async handleChannelJoin(newState) {
    const { member, guild, channel: joinedChannel } = newState;
    const logPrefix = `[PersonalVC - ${guild.name}][${member.user.tag}]`;

    try {
      const tempChannelConfig = await this.getTempChannelConfig(guild.id);
      if (!tempChannelConfig) return;

      const generatorChannels = {
        2: tempChannelConfig.DUO_CH,
        3: tempChannelConfig.TRIO_CH,
        4: tempChannelConfig.QUARTET_CH,
        0: tempChannelConfig.NOLIMIT_CH,
      };
      const userLimit = Object.values(generatorChannels).includes(
        joinedChannel.id
      )
        ? parseInt(
            Object.keys(generatorChannels).find(
              (key) => generatorChannels[key] === joinedChannel.id
            ),
            10
          )
        : -1;

      const personalChannelName = `Stanza di ${member.displayName}`;
      const existingPersonalChannel = guild.channels.cache.find(
        (ch) =>
          ch.parentId === tempChannelConfig.CATEGORY_CH &&
          ch.name === personalChannelName
      );

      // 2. Logica di creazione / riutilizzo
      if (userLimit !== -1) {
        // L'utente è entrato in un canale generatore
        if (existingPersonalChannel) {
          // La stanza personale esiste già, sposta l'utente lì
          await member.voice.setChannel(existingPersonalChannel);
          BotConsole.info(
            `${logPrefix} è stato spostato nella sua stanza personale esistente.`
          );
        } else {
          // La stanza non esiste, la creiamo
          const newChannel = await guild.channels.create({
            name: personalChannelName,
            type: ChannelType.GuildVoice,
            parent: tempChannelConfig.CATEGORY_CH,
            userLimit: userLimit,
          });
          await member.voice.setChannel(newChannel);
          BotConsole.success(
            `${logPrefix} ha creato la sua stanza personale "${newChannel.name}".`
          );
        }
      }
      // 3. L'utente è rientrato in una stanza personale che era in attesa di cancellazione?
      else if (pendingDeletions.has(joinedChannel.id)) {
        clearTimeout(pendingDeletions.get(joinedChannel.id));
        pendingDeletions.delete(joinedChannel.id);
        BotConsole.info(
          `${logPrefix} è rientrato in "${joinedChannel.name}", cancellazione annullata.`
        );
      }
    } catch (error) {
      BotConsole.error(`${logPrefix} Errore in handleChannelJoin.`, error);
    }
  },

  async handleChannelLeave(oldState) {
    const { member, guild, channel: leftChannel } = oldState;
    if (!leftChannel) return;

    try {
      const tempChannelConfig = await this.getTempChannelConfig(guild.id);
      if (!tempChannelConfig) return;

      // Controlla se il canale abbandonato è una stanza personale E se è vuoto
      if (
        this.isPersonalChannel(leftChannel, tempChannelConfig) &&
        leftChannel.members.size === 0
      ) {
        const logPrefix = `[PersonalVC - ${guild.name}]`;
        BotConsole.warning(
          `${logPrefix} Il canale "${leftChannel.name}" è vuoto. Avvio timer di cancellazione (5 min)...`
        );

        const timeoutId = setTimeout(() => {
          leftChannel
            .delete("Cancellazione automatica stanza personale vuota.")
            .then(() =>
              BotConsole.success(
                `${logPrefix} Canale "${leftChannel.name}" eliminato dopo 5 minuti.`
              )
            )
            .catch((err) =>
              BotConsole.error(
                `${logPrefix} Fallita eliminazione ritardata di "${leftChannel.name}".`,
                err
              )
            );
          pendingDeletions.delete(leftChannel.id);
        }, 5 * 60 * 1000);

        pendingDeletions.set(leftChannel.id, timeoutId);
      }
    } catch (error) {}
  },

  isPersonalChannel(channel, config) {
    if (
      channel.type !== ChannelType.GuildVoice ||
      channel.parentId !== config.CATEGORY_CH
    ) {
      return false;
    }
    const generatorIds = Object.values(config);
    return !generatorIds.includes(channel.id);
  },

  async getTempChannelConfig(guildId) {
    const guildConfig = await SqlManager.getGuildById(guildId);
    if (!guildConfig?.TEMPCHANNEL_ID) return null;
    return SqlManager.getTempChannelById(guildConfig.TEMPCHANNEL_ID);
  },
};
