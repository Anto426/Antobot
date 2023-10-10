const axios = require('axios');
const simpleGit = require('simple-git');
const fs = require('fs-extra');
const archiver = require('archiver');


function jsonddypendencebufferolyf(url, token) {

    return new Promise((resolve, reject) => {

        axios.get(url, {
            headers: {
                'Authorization': `token ${token}`,
            },
        })
            .then((response) => {
                let data = JSON.stringify(response.data, null, 2);
                console.log(`File JSON scaricato`);
                resolve(data)
            })
            .catch((error) => {
                console.error('Errore durante il download del file JSON:');
            });

    })

}









async function downloadAndCompressFolder(Url, token, folderToClone) {
    const localPath = './cache';

    try {
        const repoUrl = `https://${token}@${Url.replace("https://", "")}`;
        try {
            await simpleGit().clone(repoUrl, localPath);
            console.log('Repository clonato con successo in', localPath);
        } catch (error) {
            console.error('Errore:', error);
        }
        await fs.copy(`${localPath}/${folderToClone}`, `./${folderToClone}`);
        console.log(`Cartella ${folderToClone} copiata con successo`);

        const output = fs.createWriteStream(`./${folderToClone}.zip`);
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);
        archive.directory(folderToClone, false);
        await archive.finalize();
        console.log(`Cartella ${folderToClone} compressa in ${folderToClone}.zip`);

        await fs.remove(`./${folderToClone}`);
        await fs.remove(localPath)
        console.log(`Cartella ${folderToClone} eliminata`);

    } catch (error) {
        console.error('Errore:', error);
    }
}







module.exports = { jsonddypendencebufferolyf, downloadAndCompressFolder }