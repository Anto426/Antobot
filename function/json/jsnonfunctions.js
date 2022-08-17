const configs = require("./../../index")
async function jread(file) {
    let content = fs.readFileSync(file)
    var parseJson = JSON.parse(content)
    return parseJson
}


async function jwrite(file, content) {
    fs.writeFile(file, JSON.stringify(content), function (err) {
        if (err) throw err;
    })

}

async function jcheck(file, element) {
    let content = jread(file)
    content.forEach(x => {

    })

}
async function jremove(content, element) {
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
    } else {
        for (let i in content) {

        }
    }
}

const configs = require("./../../index")
module.exports = {
    jread: jread,
    jwrite: jwrite,
    jremove: jremove
}