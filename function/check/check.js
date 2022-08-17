const configs = require("./../../index")
const path = require('path')

async function filecheck(file) {
    try {
        fs.lstatSync(file).isFile()
        return true
    } catch {

        console.log("file non trovato")
        return false
    }
}

async function dircheck(directory, namedir) {
    let directory1 = `./${directory}/${namedir}`
    try {
        fs.lstatSync(directory1).isDirectory()
        return true
    } catch {


        fs.mkdir(path.join(directory, namedir), (err) => {
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