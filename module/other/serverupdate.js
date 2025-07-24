import express from "express";
import BotConsole from "../../class/console/BotConsole.js";
import SqlManager from "../../class/services/SqlManager.js";
import PresetEmbed from "../../class/embed/PresetEmbed.js";
import emojiManager from "../../class/services/EmojiManager.js";
import ConfigManager from "../../class/services/ConfigManager.js";
import ApplicationManager from "../../class/client/ApplicationManager.js";
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
      const { repository, commits, ref } = req.body;

      if (!repository || !commits || !ref) {
        BotConsole.error("[Webhook] Ricevuto payload non valido:", req.body);
        return res.status(400).send("Payload non valido");
      }

      const branch = ref.replace("refs/heads/", "");
      const expectedBranch = repository.master_branch;

      if (branch !== expectedBranch) {
        BotConsole.warning(
          `[Webhook] Ricevuto push su '${branch}', ma il branch monitorato è '${expectedBranch}'. Ignorato.`
        );
        return res.status(204).send("Branch non monitorato");
      }

      BotConsole.info(
        `[Webhook] Ricevuto push su "${repository.full_name}" (${ref}).`
      );

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
    const CONFIG_REPO_NAME = "Anto426/Configsbot";

    console.log(`[Webhook] Rilevato push su ${body.repository.full_name}.`);

    if (body.repository.full_name === CONFIG_REPO_NAME) {
      await this.#handleConfigsUpdate(body);
    } else {
      await this.#handleGenericUpdate(body);
    }
  }

  async #handleConfigsUpdate(body) {
    BotConsole.info(
      `[Webhook] Rilevato push sul repository di configurazione: ${body.repository.full_name}.`
    );

    const changedFiles = new Set();
    body.commits.forEach((commit) => {
      commit.added.forEach((file) => changedFiles.add(file));
      commit.modified.forEach((file) => changedFiles.add(file));
    });

    for (const file of changedFiles) {
      BotConsole.info(`[Webhook Configs] File modificato: ${file}`);
      BotConsole.info(
        `[Webhook Configs] Rilevata modifica a ${file}. programmazione riavvio del bot tra 10 minuti per applicare le modifiche...`
      );

      await sleep(600000);

      BotConsole.info(
        `[Webhook Configs] Riavvio del bot per applicare le modifiche a ${file}...`
      );

      ApplicationManager.reloadAllApplications();
    }
  }

  async #handleGenericUpdate(body) {
    if (!body.repository || !body.commits?.length) return;

    const targetGuilds = await SqlManager.getGuildsWithLogChannel();
    if (targetGuilds.length === 0) return;

    BotConsole.info(
      `[Webhook] Invio notifiche di aggiornamento per "${body.repository.full_name}" a ${targetGuilds.length} server...`
    );

    const notificationEmbed = await this.#createPushNotificationEmbed(body);

    for (const guildConfig of targetGuilds) {
      await this.#sendMessageToGuildLogChannel(
        guildConfig.LOG_ID,
        notificationEmbed
      );
    }
  }

  async #sendMessageToGuildLogChannel(channelId, embed) {
    try {
      const channel = await client.channels.fetch(channelId);
      if (channel?.isTextBased()) await channel.send({ embeds: [embed] });
    } catch (error) {
      BotConsole.error(
        `[Webhook] Impossibile inviare messaggio al canale ${channelId}:`,
        error
      );
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
        const shortId = commit.id.substring(0, 7);
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
        "Ciao a tutti! È stato appena rilasciato un nuovo aggiornamento per il bot. Ecco le principali novità:"
      )
      .addFields(
        {
          name: "📝 Modifiche Principali",
          value: commitFieldText || "Nessun messaggio di commit disponibile.",
          inline: false,
        },
        {
          name: "Branch",
          value: `\`${branch}\``,
          inline: true,
        },
        {
          name: "Commit Totali",
          value: `**${totalCommits}**`,
          inline: true,
        },
        {
          name: "Inviato da",
          value: `${pusherEmoji || "👤"} ${pusherName}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnailclient();

    return embed;
  }

  async #getAuthorEmoji(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) return null;
      const userData = await response.json();
      if (!userData?.login || !userData.avatar_url) return null;

      return await emojiManager.upsertEmoji(
        `dev_${userData.login}`,
        userData.avatar_url
      );
    } catch {
      return "👤";
    }
  }
}
