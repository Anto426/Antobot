class Time {

    constructor() {
        this.Timezone = null;
    }

    setTimezone(Timezone) {
        this.Timezone = Timezone;
    }

    getCurrentTime() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${hours}:${minutes}:${seconds}`;
    }

    getCurrentTimestamp() {
        return new Date().getTime();
    }

    getCurrentYear() {
        return new Date().getFullYear();
    }

    getTimestampByInput(year, month, day) {
        return new Date(year, month, day).getTime();
    }

    setLocalTimezone() {
        process.env.TZ = this.Timezone;
    }

    formatTimeDayscale(millis) {
        let minutes = Math.floor(millis / 60000).toFixed(0);
        let hours = 0;
        let days = 0;
        while (minutes >= 60) {
            hours += 1;
            minutes -= 60;
        }
        while (hours >= 24) {
            days += 1;
            hours -= 24;
        }

        return `${days}d : ${hours}h : ${minutes}m`;
    }

    formatTimeHoursscale(millis) {
        let minutes = 0;
        let hours = 0;
        while (millis >= 60) {
            minutes += 1;
            millis -= 60;
        }
        while (minutes >= 60) {
            hours += 1;
            minutes -= 60;
        }
        return `h:${hours} m:${minutes} s:${millis}`;
    }
}

module.exports = {
    Time
}