async function jread(interaction, type) {
    let file = `./Database/${interaction.guild.name}/${type}.json`
    let content = fs.readFileSync(file)
    var parseJson = JSON.parse(content)
    return parseJson
}


async function jwrite(dirfile, content) {
    fs.writeFile(dirfile, JSON.stringify(content), function(err) {
        if (err) throw err;
    })

}

async function jremove(content, fremove) {
    let temp = [];
    content.forEach(x => {
        for (let i in x.legth) {
            if (x[i] != fremove) {
                temp.push(x)
            }
        }
    })
    return temp

}

module.exports = {
    jread: jread,
    jwrite: jwrite,
    jremove: jremove
}