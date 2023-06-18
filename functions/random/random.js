function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


function randomChar() {
    var min = 33;
    var max = 127;
    var randomInt = getRandomInt(min, max);
    return String.fromCharCode(randomInt);
}

function randomarrsort(arr) {
    arr.sort(() => Math.random() - 0.5);
}
module.exports = { randomInt, randomFloat, randomChar, randomarrsort }