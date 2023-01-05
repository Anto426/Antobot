const { times } = require("./../time/timef")

async function timeon() {
    const timeon = new Date().getTime()
    global.timeonc
    global.timenow = new Date().getTime()
    setInterval(async () => {
        timenow = new Date().getTime()
        timeonc = await times(timenow - timeon)
    }, 1000)


}

module.exports = {
    timeon
}