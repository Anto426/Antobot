class time {

    constructor() {

    }

    getCurrentTime() {
        const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        return currentTime;
    }

    getCurrentTimeMills() {
        const currentTime = new Date().getMilliseconds()
        return currentTime;
    }


    setTimezoneEurope() {
        process.env.TZ = 'Europe/Rome';
    }
}



module.exports = {
    time
}