const fs = require("fs");


function jsonwu(pach, datai) {

    fs.readFile(pach, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); 
            obj.list.push(datai); 
            json = JSON.stringify(obj); 
            fs.writeFile(pach, json, 'utf8', callback); // write it back 
        }
    });
}

function jsonwr(pach, datai) {

    fs.readFile(pach, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); 
            obj.list.push(datai); 
            json = JSON.stringify(obj); 
            fs.writeFile(pach, json, 'utf8', callback); // write it back 
        }
    });
}

module.exports = {
    jsonwu
}