import express from 'express';
import BotConsole from '../console/BotConsole.js';

export default class WebhookManager {
    #app;
    #port;
    #emojiManager;

    constructor({ port = 3000, emojiManager }) {
        if (!emojiManager) {
            throw new Error("WebhookManager richiede un'istanza di EmojiManager.");
        }
        this.#app = express();
        this.#app.use(express.json());
        this.#port = port;
        this.#emojiManager = emojiManager;
    }

    start() {
        this.#app.post('/webhook', (req, res) => {
            res.status(202).send('Webhook Accettato');
            this.#handleWebhook(req.body).catch(err => {
                BotConsole.error('[WebhookManager] Errore non gestito nel processo webhook:', err);
            });
        });

        this.#app.listen(this.#port, () => {
            BotConsole.success(`[WebhookManager] Server in ascolto sulla porta ${this.#port}`);
        }).on('error', (err) => {
            BotConsole.error('[WebhookManager] Errore avvio server:', err);
        });
    }

    async #handleWebhook(body) {
        if (!body.commits || body.commits.length === 0) {
            BotConsole.warning('[WebhookManager] Ricevuto webhook senza commit.');
            return;
        }

        const authorUsernames = [...new Set(body.commits.map(commit => commit.author.name))];
        BotConsole.info(`[WebhookManager] Ricevuti commit da ${authorUsernames.length} autori unici. Elaborazione...`);

        for (const username of authorUsernames) {
            await this.#processAuthor(username);
        }
        BotConsole.success(`[WebhookManager] Elaborazione webhook completata.`);
    }

    async #processAuthor(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error(`API GitHub ha risposto con ${response.status}`);
            
            const userData = await response.json();
            if (!userData?.login || !userData.avatar_url) return;
            
            // De-lega tutto il lavoro sporco a EmojiManager!
            await this.#emojiManager.upsertEmoji(`dev_${userData.login}`, userData.avatar_url);

        } catch (error) {
            BotConsole.error(`[WebhookManager] Fallito processo per l'autore ${username}:`, error);
        }
    }
}