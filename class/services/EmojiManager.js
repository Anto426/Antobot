import sharp from "sharp";
import phash from "sharp-phash"; // <-- 1. Importa la libreria
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

      await emojis.fetch();
      const existingEmoji = emojis.cache.find((e) => e.name === name);
      
      const newImageBuffer = await this.#processImage(imageUrl);
      if (!newImageBuffer) {
        throw new Error(
          `Elaborazione della nuova immagine fallita per l'URL: ${imageUrl}`
        );
      }

      if (existingEmoji) {
        BotConsole.info(
          `[EmojiManager] Emoji :${name}: esiste. Controllo se l'immagine è cambiata.`
        );

        const oldImageBuffer = await this.#processImage(existingEmoji.url);
        if (!oldImageBuffer) {
            BotConsole.warning(`[EmojiManager] Impossibile processare la vecchia immagine per :${name}:. L'emoji verrà aggiornato per sicurezza.`);
        } else {
            const newHash = await phash(newImageBuffer);
            const oldHash = await phash(oldImageBuffer);
    
            if (newHash === oldHash) {
              BotConsole.info(
                `[EmojiManager] L'immagine per :${name}: è identica. Nessun aggiornamento necessario.`
              );
              return existingEmoji; // Le immagini sono uguali, esci
            }
        }
        
        BotConsole.info(
          `[EmojiManager] L'immagine per :${name}: è diversa. Verrà aggiornato.`
        );
        
        await existingEmoji.delete(
          "Webhook: Sostituzione con avatar aggiornato"
        );
        BotConsole.info(
          `[EmojiManager] Vecchio emoji globale :${name}: eliminato.`
        );
      }

      // La nuova immagine è già processata e pronta in newImageBuffer
      const newOrUpdatedEmoji = await emojis.create({
        attachment: newImageBuffer, // <-- 3. Usa il buffer già processato
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

      return await sharp(imageBuffer)
        .resize(128, 128)
        .png() 
        .toBuffer();
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