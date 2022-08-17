async function activity() {

    let frasi = [" moderare il server", "/help"]
    var x = Math.floor(Math.random() * frasi.length);
    configs.client.user.setActivity(frasi[x].toString());

}


const configs = require("./../../index")
module.exports = {
    activity: activity
}