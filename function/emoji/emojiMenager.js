class emojiMenager {
    constructor() { }


    async processImage(url) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(url);
            if (!response.ok) reject('Failed to fetch image');

            const buffer = await response.buffer();
            if (buffer.length > 256 * 1024) {
                const resizedBuffer = await sharp(buffer)
                    .resize(128, 128)
                    .toFormat('png', { quality: 80 })
                    .toBuffer();

                resolve(resizedBuffer);
            }
            resolve(buffer);
        })

    }

    async addEmoji(url, type, name) {
        return new Promise(async (resolve, reject) => {
            try {
                const processedBuffer = await this.processImage(url);
                let emoji = await client.application?.emojis.create({
                    attachment: processedBuffer,
                    name: `${type}_${name}`,
                });
                resolve(emoji);
            } catch (error) {
                reject(-1);
            }
        })
    }

    async removeEmoji(emoji) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.application?.emojis.delete(emoji);
                resolve(0);
            } catch (error) {
                reject(-1);
            }
        })
    }

    async updateEmoji(url, oldEmoji) {
        return new Promise(async (resolve, reject) => {
            try {
                let type = oldEmoji.name.split("_")[0];
                let name = oldEmoji.name.split("_")[1];
                await this.removeEmoji(oldEmoji).catch((err) => { reject(err) });
                let newEmoji = await this.addEmoji(url, type, name).catch((err) => { reject(err) });
                resolve(newEmoji);
            } catch (error) {
                reject(-1);
            }

        })
    }







}