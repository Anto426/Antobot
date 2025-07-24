import express from "express";
import BotConsole from "../../class/console/BotConsole.js";
import SqlManager from "../../class/services/SqlManager.js";
import PresetEmbed from "../../class/embed/PresetEmbed.js";
import emojiManager from "../../class/services/EmojiManager.js";
import ApplicationManager from "../../class/client/ApplicationManager.js";

export default class ServerUpdate {
  #app;
  #port;
  #reloadScheduled = false;

  constructor() {
    this.#app = express();
    this.#app.use(express.json());
    this.#port = process.env.WEBHOOK_PORT || 3000;
  }

  run() {
    this.#app.post("/webhook", (req, res) => {
      const { repository, commits, ref } = req.body;

      if (!repository || !commits || !ref) {
        BotConsole.error("[Webhook] Payload non valido:", req.body);
        return res.status(400).send("Payload non valido");
      }

      const branch = ref.replace("refs/heads/", "");
      const expectedBranch = repository.master_branch;

      if (branch !== expectedBranch) {
        BotConsole.warning(
          `[Webhook] Push ricevuto su '${branch}', ma il branch monitorato è '${expectedBranch}'. Ignorato.`
        );
        return res.status(204).send("Branch non monitorato");
      }

      BotConsole.info(
        `[Webhook] Push su "${repository.full_name}" (${ref}) accettato.`
      );

      res.status(202).send("Webhook accettato");
      this.#handleWebhook(req.body).catch((err) =>
        BotConsole.error("[Webhook] Errore durante la gestione:", err)
      );
    });

    this.#app
      .listen(this.#port, () => {
        BotConsole.success(
          `[Webhook] Server in ascolto sulla porta ${this.#port}`
        );
      })
      .on("error", (err) => {
        BotConsole.error("[Webhook] Errore di avvio:", err);
      });
  }

  async #handleWebhook(body) {
    const CONFIG_REPO_NAME = "Anto426/Configsbot";

    if (body.repository.full_name === CONFIG_REPO_NAME) {
      await this.#handleConfigsUpdate(body);
    } else {
      await this.#handleGenericUpdate(body);
    }
  }

  async #handleConfigsUpdate(body) {
    BotConsole.info(
      `[Webhook Configs] Push rilevato da ${body.repository.full_name}`
    );

    const changedFiles = new Set();
    body.commits.forEach((commit) => {
      commit.added.forEach((file) => changedFiles.add(file));
      commit.modified.forEach((file) => changedFiles.add(file));
    });

    if (changedFiles.size === 0) {
      BotConsole.info("[Webhook Configs] Nessun file modificato.");
      return;
    }

    for (const file of changedFiles) {
      BotConsole.info(`[Webhook Configs] File modificato: ${file}`);
    }

    if (this.#reloadScheduled) {
      BotConsole.info(
        "[Webhook Configs] Riavvio già programmato. Nessuna nuova azione."
      );
      return;
    }

    this.#reloadScheduled = true;
    BotConsole.info(
      "[Webhook Configs] Riavvio del bot programmato tra 10 minuti..."
    );

    await this.#sleep(10 * 60 * 1000);

    BotConsole.info(
      "[Webhook Configs] Riavvio in corso per applicare le modifiche..."
    );
    ApplicationManager.reloadAllApplications();

    this.#reloadScheduled = false;
  }

  async #handleGenericUpdate(body) {
    if (!body.repository || !body.commits?.length) return;

    const targetGuilds = await SqlManager.getGuildsWithLogChannel();
    if (targetGuilds.length === 0) return;

    BotConsole.info(
      `[Webhook] Notifica inviata a ${targetGuilds.length} server per ${body.repository.full_name}`
    );

    const embed = await this.#createPushNotificationEmbed(body);

    for (const guildConfig of targetGuilds) {
      await this.#sendMessageToGuildLogChannel(guildConfig.LOG_ID, embed);
    }
  }

  async #sendMessageToGuildLogChannel(channelId, embed) {
    try {
      const channel = await client.channels.fetch(channelId);
      if (channel?.isTextBased()) {
        await channel.send({ embeds: [embed] });
      }
    } catch (err) {
      BotConsole.error(`[Webhook] Errore invio messaggio a ${channelId}:`, err);
    }
  }

  async #createPushNotificationEmbed(body) {
    const repoName = body.repository.full_name;
    const repoUrl = body.repository.html_url;
    const branch = body.ref.split("/").pop();
    const pusherName = body.pusher.name;

    const pusherEmoji = await this.#getAuthorEmoji(pusherName);

    const commitDescriptions = body.commits
      .slice(0, 5)
      .map((commit) => {
        const shortId = commit.id.slice(0, 7);
        const message = commit.message.split("\n")[0].slice(0, 60);
        return `> [\`${shortId}\`](${commit.url}) ${message}`;
      })
      .join("\n");

    const totalCommits = body.commits.length;
    const commitFieldText =
      totalCommits > 5
        ? `${commitDescriptions}\n> *... e altri ${totalCommits - 5} commit.*`
        : commitDescriptions;

    const embed = await new PresetEmbed().init();
    embed
      .setAuthor({
        name: repoName,
        iconURL:
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        url: repoUrl,
      })
      .setTitle("✨ Aggiornamento Rilasciato!")
      .setDescription(
        "È stato appena rilasciato un nuovo aggiornamento per il bot. Ecco i dettagli:"
      )
      .addFields(
        {
          name: "📝 Modifiche",
          value: commitFieldText || "Nessun messaggio di commit.",
          inline: false,
        },
        {
          name: "Branch",
          value: `\`${branch}\``,
          inline: true,
        },
        {
          name: "Totale Commit",
          value: `**${totalCommits}**`,
          inline: true,
        },
        {
          name: "Autore",
          value: `${pusherEmoji || "👤"} ${pusherName}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnailclient()

    return embed;
  }

  async #getAuthorEmoji(username) {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) return null;

      const data = await res.json();
      if (!data?.login || !data.avatar_url) return null;

      return await emojiManager.upsertEmoji(
        `dev_${data.login}`,
        data.avatar_url
      );
    } catch {
      return "👤";
    }
  }

  #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
