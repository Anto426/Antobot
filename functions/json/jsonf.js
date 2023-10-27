const fs = require("fs");
const { checkvs } = require("../check/check");


function jsonwu(filePath, parr, newData) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
        } else {
            try {
                const obj = JSON.parse(data);
                if (checkvs(obj[parr], newData)) {
                    console.log("Valore gia presente");
                    return false;
                }
                obj.list.push(newData);
                const json = JSON.stringify(obj, null, 2);
                fs.writeFile(filePath, json, 'utf8', (err) => {
                    if (err) {
                        console.error('Errore nella scrittura del file:', err);
                    } else {
                        console.log('Data aggiunto', filePath);
                        return true
                    }
                });
            } catch (error) {
                console.error('Errore:', error);
            }
        }
    });
}


function jsonrs(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
            return null
        } else {
            try {
                let obj = JSON.parse(data);
                return obj
            } catch (error) {
                console.error('Errore:', error);
                return null
            }
        }
    });
}


function jsonras(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Errore nella lettura del file:', err);
                reject(err);
            } else {
                try {
                    let obj = JSON.parse(data);
                    resolve(obj);
                } catch (error) {
                    console.error('Errore:', error);
                    reject(error);
                }
            }
        });
    });
}


module.exports = {
    jsonwu,
    jsonrs,
    jsonras
}