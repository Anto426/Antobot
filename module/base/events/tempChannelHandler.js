import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/services/SqlManager.js";
import { Events, ChannelType, PermissionsBitField } from "discord.js";

const pendingDeletions = new Map();
const originalLimits = new Map(); // NUOVO: Mappa per salvare i limiti originali

export default {
  name: "PersonalVoiceChannelManager",
  eventType: Events.VoiceStateUpdate,
  isActive: true,

  async execute(oldState, newState) {
    if (oldState.channelId === newState.channelId) {
      return;
    }

    if (newState.channelId) {
      await this.handleChannelJoin(newState);
    }

    if (oldState.channelId) {
      await this.handleChannelLeave(oldState);
    }
  },

  async handleChannelJoin(newState) {
    const { member, guild, channel: joinedChannel } = newState;
    const logPrefix = `[PersonalVC - ${guild.name}][${member.user.tag}]`;

    try {
      const tempChannelConfig = await this.getTempChannelConfig(guild.id);
      if (!tempChannelConfig) return; // --- NUOVA LOGICA: Gestione dell'ingresso del BOT in un canale ---

      if (member.id === newState.client.user.id) {
        if (this.isPersonalChannel(joinedChannel, tempChannelConfig)) {
          const currentLimit = joinedChannel.userLimit;
          if (currentLimit > 0) {
            originalLimits.set(joinedChannel.id, currentLimit);
            const newLimit = currentLimit + 1;
            await joinedChannel.setUserLimit(
              newLimit,
              "Aumento limite per ingresso del bot"
            );
            BotConsole.info(
              `[PersonalVC - ${guild.name}] Bot è entrato in "${joinedChannel.name}", limite aumentato a ${newLimit}.`
            );
          }
        }
        return; // Termina l'esecuzione per il bot qui
      } // --- FINE NUOVA LOGICA ---
      if (member.user.bot) return; // Ignora gli altri bot // --- Logica per determinare se l'utente è entrato in un canale generatore ---

      const generatorChannels = {
        2: tempChannelConfig.DUO_CH,
        3: tempChannelConfig.TRIO_CH,
        4: tempChannelConfig.QUARTET_CH,
        0: tempChannelConfig.NOLIMIT_CH,
      };

      let userLimit = -1;
      for (const [limit, id] of Object.entries(generatorChannels)) {
        if (joinedChannel.id === id) {
          userLimit = parseInt(limit, 10);
          break;
        }
      }

      const personalChannelName = `Stanza di ${member.displayName}`;
      const existingPersonalChannel = guild.channels.cache.find(
        (ch) =>
          ch.parentId === tempChannelConfig.CATEGORY_CH &&
          ch.name === personalChannelName
      );

      if (userLimit !== -1) {
        // L'utente è entrato in un canale generatore.
        if (existingPersonalChannel) {
          if (existingPersonalChannel.userLimit !== userLimit) {
            await existingPersonalChannel.setUserLimit(
              userLimit,
              `Richiesta nuovo limite da ${member.user.tag}`
            );
            BotConsole.info(
              `${logPrefix} ha aggiornato la sua stanza a un limite di ${
                userLimit || "Nessuno"
              }.`
            );
          }
          await member.voice.setChannel(existingPersonalChannel);
        } else {
          const newChannel = await guild.channels.create({
            name: personalChannelName,
            type: ChannelType.GuildVoice,
            parent: tempChannelConfig.CATEGORY_CH,
            userLimit: userLimit,
            permissionOverwrites: [
              {
                id: member.id,
                allow: [
                  PermissionsBitField.Flags.ManageChannels,
                  PermissionsBitField.Flags.MoveMembers,
                  PermissionsBitField.Flags.MuteMembers,
                  PermissionsBitField.Flags.DeafenMembers,
                ],
              },
            ],
          });
          await member.voice.setChannel(newChannel);
          BotConsole.success(
            `${logPrefix} ha creato la sua stanza personale "${newChannel.name}".`
          );
        }
      } else if (pendingDeletions.has(joinedChannel.id)) {
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
    const { guild, channel: leftChannel, member } = oldState; // Aggiunto member
    if (!leftChannel) return;
    const logPrefix = `[PersonalVC - ${guild.name}]`;

    try {
      const tempChannelConfig = await this.getTempChannelConfig(guild.id);
      if (!tempChannelConfig) return; // --- NUOVA LOGICA: Gestione dell'uscita del BOT da un canale ---

      if (member.id === oldState.client.user.id) {
        if (originalLimits.has(leftChannel.id)) {
          const originalLimit = originalLimits.get(leftChannel.id);
          await leftChannel.setUserLimit(
            originalLimit,
            "Ripristino limite per uscita del bot"
          );
          BotConsole.info(
            `[PersonalVC - ${guild.name}] Bot è uscito da "${leftChannel.name}", limite ripristinato a ${originalLimit}.`
          );
          originalLimits.delete(leftChannel.id);
        }
        return; // Termina l'esecuzione per il bot qui
      } // --- FINE NUOVA LOGICA ---
      if (
        this.isPersonalChannel(leftChannel, tempChannelConfig) &&
        leftChannel.members.size === 0
      ) {
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
        }, 5 * 60 * 1000); // 5 minuti

        pendingDeletions.set(leftChannel.id, timeoutId);
      }
    } catch (error) {
      BotConsole.error(`${logPrefix} Errore in handleChannelLeave.`, error);
    }
  },

  isPersonalChannel(channel, config) {
    if (
      !channel || // Aggiunto controllo per evitare errori se il canale non esiste
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
