import express from "express";
import BotConsole from "../../class/console/BotConsole.js";
import SqlManager from "../../class/services/SqlManager.js";
import PresetEmbed from "../../class/embed/PresetEmbed.js";
import emojiManager from "../../class/services/EmojiManager.js";

export default class serverupdate {
  #app;
  #port;

  constructor() {
    this.#app = express();
    this.#app.use(express.json());
    this.#port = process.env.WEBHOOK_PORT || 3000;
  }

  run() {
    this.#app.post("/webhook", (req, res) => {
      res.status(202).send("Webhook Accettato");
      this.#handleWebhook(req.body).catch((err) =>
        BotConsole.error("[Webhook] Errore non gestito:", err)
      );
    });

    this.#app
      .listen(this.#port, () => {
        BotConsole.success(
          `[Webhook] Server in ascolto sulla porta ${this.#port}`
        );
      })
      .on("error", (err) => {
        BotConsole.error("[Webhook] Errore avvio server:", err);
      });
  }

  async #handleWebhook(body) {
    if (!body.repository || !body.commits?.length) return;

    const targetGuilds = await SqlManager.getGuildsWithLogChannel();
    if (targetGuilds.length === 0) return;

    const embed = await this.#createPushNotificationEmbed(body);

    for (const guildConfig of targetGuilds) {
      await this.#sendMessageToGuildLogChannel(guildConfig.LOG_ID, embed);
    }
  }

  async #sendMessageToGuildLogChannel(channelId, embed) {
    try {
      const channel = await client.channels.fetch(channelId);
      if (channel?.isTextBased()) await channel.send({ embeds: [embed] });
    } catch {}
  }

  async #createPushNotificationEmbed(body) {
    const pusherName = body.pusher.name;
    const emoji = await this.#getAuthorEmoji(pusherName); // Usa l'helper per ottenere l'emoji

    const description = body.commits
      .slice(0, 5)
      .map((commit) => {
        const shortId = commit.id.substring(0, 7);
        const message = commit.message.split("\n")[0].slice(0, 60);
        return `[\`${shortId}\`](${commit.url}) ${message}`;
      })
      .join("\n");

    const embed = new PresetEmbed()
      .setColor("#171515")
      .setAuthor({
        name: `Nuovo Push da ${pusherName}`,
        iconURL: emoji?.url, // Usa l'URL dell'emoji come icona
        url: `https://github.com/${pusherName}`,
      })
      .setTitle(`Commit su [${body.ref.split("/").pop()}]`)
      .setURL(body.compare)
      .setDescription(description);

    return embed;
  }

  async #getAuthorEmoji(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) return null;
      const userData = await response.json();
      if (!userData?.login || !userData.avatar_url) return null;

      // Usa l'istanza importata di EmojiManager
      return await emojiManager.upsertEmoji(
        `dev_${userData.login}`,
        userData.avatar_url
      );
    } catch {
      return "👤";
    }
  }
}

// Esporta una singola istanza globale (Singleton)
