async function statusupdate() {

    setInterval(async () => {
        frasi = require("./../../settings/status.json")
        var x = Math.floor(Math.random() * frasi["1"].length);
        client.user.setActivity(frasi["1"][x].toString());

    }, 5000 * 60)

}
module.exports = { statusupdate }