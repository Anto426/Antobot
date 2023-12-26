class Cmath {
    constructor() {

    }
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

module.exports = {
    Cmath
}