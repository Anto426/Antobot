const configs = require("./../../index")
async function jread(file) {
    try {
        let content = configs.fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        return parseJson
    } catch (err) {
        console.log(err)
    }
}

async function jwrite(file, content) {
    try {
        configs.fs.writeFile(file, JSON.stringify(content), function (err) {
            if (err) throw err;
        })
    } catch (err) {
    }
}

module.exports = {
    jread: jread,
    jwrite: jwrite,

}