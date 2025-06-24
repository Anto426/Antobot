import sharp from "sharp";
import BotConsole from "../console/BotConsole.js";

class EmojiManager {
  async upsertEmoji(name, imageUrl) {
    try {
      const emojis = client.application?.emojis;
      if (!emojis) {
        throw new Error(
          "Impossibile accedere al gestore di emoji dell'applicazione (client.application.emojis)."
        );
      }

      const imageBuffer = await this.#processImage(imageUrl);
      if (!imageBuffer) {
        throw new Error(
          `Elaborazione dell'immagine fallita per l'URL: ${imageUrl}`
        );
      }

      // Forza l'aggiornamento della cache per avere la lista più recente
      await emojis.fetch();

      const existingEmoji = emojis.cache.find((e) => e.name === name);

      if (existingEmoji) {
        await existingEmoji.delete(
          "Webhook: Sostituzione con avatar aggiornato"
        );
        BotConsole.info(
          `[EmojiManager] Vecchio emoji globale :${name}: eliminato.`
        );
      }

      const newOrUpdatedEmoji = await emojis.create({
        attachment: imageBuffer,
        name,
        reason: existingEmoji
          ? "Webhook: Avatar aggiornato"
          : "Webhook: Nuovo collaboratore",
      });

      if (existingEmoji) {
        BotConsole.success(
          `[EmojiManager] Emoji globale :${name}: è stato aggiornato (ricreato).`
        );
      } else {
        BotConsole.success(
          `[EmojiManager] Emoji globale :${name}: è stato creato con successo.`
        );
      }

      return newOrUpdatedEmoji;
    } catch (error) {
      BotConsole.error(
        `[EmojiManager] Fallito processo di upsert per l'emoji "${name}":`,
        error
      );
      return null;
    }
  }

  async #processImage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} durante il fetch dell'immagine.`
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      return await sharp(imageBuffer).resize(128, 128).png().toBuffer();
    } catch (error) {
      BotConsole.error(
        `[EmojiManager] Fallito processing dell'immagine da ${url}`,
        error
      );
      return null;
    }
  }
}

export default new EmojiManager();
