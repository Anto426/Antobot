function times(millis) {
    var minutes = Math.floor(millis / 60000).toFixed(0);
    var hour = 0
    var day = 0
    if (minutes >= 60) {
        do {
            hour = hour + 1
            minutes = minutes - 60
        } while (minutes >= 60)
    }
    if (hour >= 24) {
        do {
            day = day + 1
            hour = hour - 24
        } while (hour >= 24)

    }
    return day + "d :" + hour + " h:" + minutes + " m"
}


const configs = require("./../../index")
module.exports = {
    times: times
}