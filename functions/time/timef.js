function times(millis) {
    var minutes = Math.floor(millis / 60000).toFixed(0);
    var hour = 0
    var day = 0
    while (minutes >= 60) {
        hour = hour + 1
        minutes = minutes - 60
    }
    while (hour >= 24) {
        day = day + 1
        hour = hour - 24
    }

    return day + "d :" + hour + " h:" + minutes + " m"
}


module.exports = {
    times: times
}