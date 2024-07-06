const fs = require("fs")
const { consolelog } = require("../log/consolelog");



async function collectioncrete(mincollec, patch, folders, extensions) {



    return new Promise((resolve) => {

        folders.forEach(async folder => {
            let patch1;

            fs.stat(`${patch}/${folder}`, (err, stats) => {
                if (err) {
                    console.error('Errore:', err);
                } else {
                    if (stats.isDirectory()) {
                        patch1 = `${patch}/${folder}`;
                    } else {
                        patch1 = `${patch}`;
                    }

                    let contf = fs.readdirSync(patch1);
                    if (contf.length > 0) {
                        for (let x of contf) {
                            if (x.endsWith(extensions)) {
                                try {
                                    let file = require(`${patch1}/${x}`);
                                    if (file && file.name || file.data)
                                        mincollec.set(file.name, file);


                                } catch (error) {
                                    consolelog(error)
                                    consolelog("Errore nel caricamento del file :" + x, "red");
                                }
                            } else {
                                let patch2 = `${patch}/${folder}`;
                                collectioncrete(mincollec, patch2, Array.isArray(x) ? x : [x], extensions)
                            }
                        }
                    }
                    resolve(0)
                }
            });
        });
    })
}



module.exports = { collectioncrete }
