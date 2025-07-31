import BotConsole from "../../../class/console/BotConsole.js";
import SynchronizationManager from "../../../class/services/SynchronizationManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import { PermissionsBitField } from "discord.js";
import CommandGuildUpdate from "../../../class/Guild/CommandGuildUpdate.js";

export default {
  name: "BotAddedToGuild",
  eventType: "guildCreate",
  isActive: true,

  async execute(guild) {
    try {
      BotConsole.success(`Nuovo server! Aggiunto a "${guild.name}"`, {
        ID: guild.id,
        Membri: guild.memberCount,
        ProprietarioID: guild.ownerId,
      });

      await CommandGuildUpdate.registerCommandsToGuild(guild);

      await SynchronizationManager.synchronizeGuild(guild);

      await this.sendWelcomeMessage(guild);
    } catch (error) {
      BotConsole.error(
        `Errore durante l'evento guildCreate per "${guild.name}" (${guild.id})`,
        error
      );
    }
  },

  async sendWelcomeMessage(guild) {
    let channelToSend = null;
    const me = guild.members.me;

    if (
      guild.systemChannel &&
      guild.systemChannel
        .permissionsFor(me)
        .has(PermissionsBitField.Flags.SendMessages)
    ) {
      channelToSend = guild.systemChannel;
    } else {
      const textChannels = guild.channels.cache.filter(
        (c) =>
          c.type === 0 &&
          c.permissionsFor(me).has(PermissionsBitField.Flags.SendMessages)
      );
      if (textChannels.size > 0) {
        channelToSend = textChannels.first();
      }
    }

    const embed = await new PresetEmbed({ guild }).init();

    embed.setMainContent(
      `Grazie per avermi aggiunto a ${guild.name}! 🎉`,
      "Sono il tuo assistente multifunzione 🤖, pronto ad aiutarti a gestire il server.\n\n" +
        "Per iniziare, ecco alcuni comandi utili: 🚀\n" +
        "• Usa `/help` 📖 per vedere la lista completa dei miei comandi.\n" +
        "• Usa `/setup` ⚙️ per configurare le varie funzionalità.\n\n"
    );

    if (channelToSend) {
      try {
        await channelToSend.send({ embeds: [embed] });
      } catch {
        try {
          const owner = await guild.fetchOwner();
          await owner.send({ embeds: [embed] });
        } catch (dmError) {
          BotConsole.error(
            `Fallito invio messaggio di benvenuto in "${guild.name}" (canale e DM).`,
            dmError
          );
        }
      }
    } else {
      BotConsole.warning(
        `Nessun canale adatto trovato in "${guild.name}" per inviare il messaggio di benvenuto.`
      );
    }
  },
};
