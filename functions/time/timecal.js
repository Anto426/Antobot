const { times } = require("./timef")

function timecal(date) {
    try {
        const currentTimestamp = new Date().getTime(optionsdate)
        console.log(currentTimestamp)
        console.log(new Date(currentTimestamp).toLocaleDateString("it-IT",optionsdate))
        return currentTimestamp
    } catch (err) { console.log(err) }
}
module.exports = { timecal }