let interaction = "Antos's Chill"
const file = `./Database/${interaction.guild.name}/tiket.js`
const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(file, 'test'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});