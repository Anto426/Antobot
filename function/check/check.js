const configs = require("./../../index")
const path = require('path')

async function filecheck(file) {
    let trovato = false
    try {
        configs.fs.lstatSync(file).isFile()
        trovato = true
    } catch {

        console.log("file non trovato")
        trovato = false
    }

    return trovato
}

async function dircheck(directory, namedir) {
    let directory1 = `./${directory}/${namedir}`
    try {
        configs.fs.lstatSync(directory1).isDirectory()
        return true
    } catch {


        configs.fs.mkdir(path.join(directory, namedir), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Directory created successfully!');
        });

        return false
    }
}


module.exports = {
    filecheck: filecheck,
    dircheck: dircheck
}