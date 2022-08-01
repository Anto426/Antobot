async function filecheck(){

}

async function dircheck(interaction){
    let directory = `./Database/${interaction.guild.name}`
    try {
        fs.lstatSync(directory).isDirectory()
    } catch {
        const path = require('path');


        fs.mkdir(path.join(`./Database/`, interaction.guild.name), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Directory created successfully!');
        });
    }
}

