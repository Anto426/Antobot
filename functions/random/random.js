function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


function randomChar() {
    var min = 65;
    var max = 122;
    var int = randomInt(min, max);
    if (int > 90 && int < 97) {
        return randomChar();
    }
    return String.fromCharCode(int);
}

function randomarrsort(arr) {
    arr.sort(() => Math.random() - 0.5);
}
module.exports = { randomInt, randomFloat, randomChar, randomarrsort }