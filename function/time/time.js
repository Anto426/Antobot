class time {

    constructor() {
        this.timezone
    }

    setTimezone(timezone){
        this.timezone = timezone
    }

    getCurrentTime() {
        const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        return currentTime;
    }

    getCurrentTimeMills() {
        const currentTime = new Date().getMilliseconds()
        return currentTime;
    }


    setTimezone() {
        process.env.TZ = this.timezone;
    }
}



module.exports = {
    time
}