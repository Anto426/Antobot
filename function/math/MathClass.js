class MathClass {
    constructor() {

    }
    
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

module.exports = {
    MathClass
}