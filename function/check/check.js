const path = require('path')

async function filecheck(file) {
    try {
        fs.lstatSync(file).isFile()
    } catch {



        fs.writeFile(path.join(file, null), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('File created successfully!');
        });
    }
}

async function dircheck(interaction) {
    let directory = `./Database/${interaction.guild.name}`
    try {
        fs.lstatSync(directory).isDirectory()
    } catch {



        fs.mkdir(path.join(`./Database/`, interaction.guild.name), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Directory created successfully!');
        });
    }
}

module.exports = {
    filecheck: filecheck,
    dircheck: dircheck
}