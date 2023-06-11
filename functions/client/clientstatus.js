async function statusupdate() {

    setInterval(async () => {
        let frasi = ["a moderare il server", "a /help"]
        var x = Math.floor(Math.random() * frasi.length);
        client.user.setActivity(frasi[x].toString());

    }, 5000 * 60)

}
module.exports = { statusupdate }