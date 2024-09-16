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
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24).toFixed(0);
        minutes -= (hours * 60);
        hours = hours - (days * 24);
        return `${days}d : ${hours}h : ${minutes}m`;
    }

    formatTimeHoursscale(millis) {
        let minutes = Math.floor(millis / 60000).toFixed(0);
        let hours = Math.floor(minutes / 60);
        minutes -= (hours * 60);
        hours = Math.floor(hours).toFixed(0);
        let sec = ((millis - (minutes * 60000) - (hours * (1000 * 60 * 60))) / 1000).toFixed(0);
        return `${hours}h : ${minutes}m : ${sec}s`;
    }



    fortmatTimestamp(millis) {
        let hours = Math.floor(millis / (60000 * 60)).toFixed(0);
        if (hours > 24) {
            return this.formatTimeDayscale(millis);
        } else {
            return this.formatTimeHoursscale(millis);
        }
    }

    formatDate(date) {
        return date.toISOString().slice(0, 10);
    }
}

module.exports = {
    Time
}