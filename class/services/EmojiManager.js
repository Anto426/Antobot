import sharp from 'sharp';
import BotConsole from '../console/BotConsole.js';


export default class EmojiManager {
    #targetGuildId;


    constructor({ targetGuildId }) {
        if (!targetGuildId) {
            throw new Error("EmojiManager richiede un targetGuildId.");
        }
        this.#targetGuildId = targetGuildId;
    }


    async upsertEmoji(name, imageUrl) {
        try {
            const guild = await client.guilds.fetch(this.#targetGuildId);
            if (!guild) throw new Error(`Gilda ${this.#targetGuildId} non trovata.`);

            const imageBuffer = await this.#processImage(imageUrl);
            if (!imageBuffer) throw new Error("Elaborazione immagine fallita.");

            const existingEmoji = guild.emojis.cache.find(e => e.name === name);

            if (existingEmoji) {
                await existingEmoji.edit({ image: imageBuffer, reason: "Aggiornamento automatico via webhook" });
                BotConsole.info(`[EmojiManager] Emoji :${name}: aggiornato su ${guild.name}.`);
                return existingEmoji;
            } else {
                const newEmoji = await guild.emojis.create({ attachment: imageBuffer, name: name, reason: "Nuovo collaboratore via webhook" });
                BotConsole.success(`[EmojiManager] Emoji :${name}: creato su ${guild.name}.`);
                return newEmoji;
            }
        } catch (error) {
            BotConsole.error(`[EmojiManager] Fallito processo di upsert per l'emoji ${name}:`, error);
            return null;
        }
    }

    async #processImage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status} durante il fetch dell'immagine.`);
            
            const imageBuffer = Buffer.from(await response.arrayBuffer());
            
            if (imageBuffer.length > 256 * 1024) {
                BotConsole.debug(`[EmojiManager] Immagine troppo grande (${(imageBuffer.length / 1024).toFixed(1)}KB). Ridimensionamento...`);
                return await sharp(imageBuffer)
                    .resize(128, 128)
                    .png()
                    .toBuffer();
            }
            return imageBuffer;
        } catch (error) {
            BotConsole.error(`[EmojiManager] Fallito scaricamento o processing immagine da ${url}`, error);
            return null;
        }
    }
}