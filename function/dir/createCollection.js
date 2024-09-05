
const fs = require("fs")



async function createCollection(minCollection, path, folders, extensions) {

    return new Promise((resolve) => {

        folders.forEach(async folder => {
            let path1;

            fs.stat(`${path}/${folder}`, (err, stats) => {
                if (err) {
                    console.error('Error:', err);
                } else {
                    if (stats.isDirectory()) {
                        path1 = `${path}/${folder}`;
                    } else {
                        path1 = `${path}`;
                    }
                    let contf = fs.readdirSync(path1);
                    if (contf.length > 0) {
                        for (let x of contf) {
                            if (x.endsWith(extensions)) {
                                try {
                                    let file = require(`${path1}/${x}`);
                                    if (file && file.name || file.data)
                                        minCollection.set(file.name, file);
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                let path2 = `${path}/${folder}`;
                                createCollection(minCollection, path2, Array.isArray(x) ? x : [x], extensions)
                            }
                        }
                    }
                    resolve(0)
                }
            });
        });
    })
}



module.exports = { createCollection }
