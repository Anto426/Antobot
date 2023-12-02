function getCurrentTime() {
    const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    return currentTime;
}

function getCurrentTimeMills() {
    const currentTime = new Date().getMilliseconds()
    return currentTime;
}
module.exports = {
    getCurrentTime,
    getCurrentTimeMills
}