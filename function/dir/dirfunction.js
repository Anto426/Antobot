const fs = require("fs")
const { consolelog } = require("../log/consolelog");



async function collectioncrete(mincollec, patch, folder, extensions) {

    return new Promise((resolve, reject) => {

        patch = `${patch}/${folder}`;
        let contf = fs.readdirSync(patch);

        if (contf.length !== 0) {
            for (let x of contf) {
                if (x.endsWith(extensions)) {
                    try {
                        let file = require(`./../../${patch}/${x}`);
                        if (file && file.name && file.data)
                            mincollec.set(file.name, file);
                        else
                            if (file && file.name)
                                mincollec.set(file.name);

                    } catch (error) {
                        consolelog("Errore nel caricamento del file :" + x);
                    }
                } else {
                    collectioncrete(mincollec, patch, x, extensions)
                        .then((x) => {
                            resolve(x);
                        })
                        .catch(() => {
                            reject(x);
                        })
                }
            }
            resolve(0)
        } else {
            reject(-1)
        }

    })

}



module.exports = { collectioncrete }
