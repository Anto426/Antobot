function times(millis) {
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


function times0(s) {
    let m = 0,
        h = 0
    while (s >= 60) {

        m += 1
        s -= 60

    }
    while (m >= 60) {

        h += 1
        m -= 60

    }
    return "h:" + h + " m:" + m + "s:" + s
}
module.exports = {
    times,
    times0
}