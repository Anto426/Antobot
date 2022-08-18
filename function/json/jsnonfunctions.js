const configs = require("./../../index")
async function jread(file) {
    try {
        let content = configs.fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        return parseJson
    } catch {

    }
}


async function jwrite(file, content) {
    try {
        configs.fs.writeFile(file, JSON.stringify(content), function (err) {
            if (err) throw err;
        })
    } catch {

    }
}
async function jremove(content, element) {
    try {
        let temp = [];
        if (content.isArray()) {
            content.forEach(x => {
                for (let i in x.legth) {
                    if (x[i] != element) {
                        temp.push(x)
                    }
                }
            })
            return temp
        }
    } catch {

    }
}

module.exports = {
    jread: jread,
    jwrite: jwrite,
    jremove: jremove
}