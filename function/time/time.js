class time {

    constructor() {
        this.timezone
    }

    setTimezone(timezone) {
        this.timezone = timezone
    }

    getCurrentTime() {
        return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    }

    getCurrentTimestamp() {

        return new Date().getTime()
    }

    getcorrentYear() {
        return new Date().getFullYear()
    }

    getTimestampbyinput(year, mouth, day) {
        return new Date(year, mouth, day).getTime()
    }

    setTimezone() {
        process.env.TZ = this.timezone;
    }


    formatttimedayscale(millis) {
        var minutes = Math.floor(millis / 60000).toFixed(0);
        var hour = 0
        var day = 0
        while (minutes >= 60) {
            hour += 1
            minutes -= 60
        }
        while (hour >= 24) {
            day += 1
            hour -= 24
        }

        return day + "d :" + hour + " h:" + minutes + " m"
    }


    formatttimehoursscale(millis) {
        let m = 0,
            h = 0
        while (millis >= 60) {

            m += 1
            millis -= 60

        }
        while (m >= 60) {

            h += 1
            m -= 60

        }
        return "h:" + h + " m:" + m + "s:" + s
    }
}



module.exports = {
    time
}