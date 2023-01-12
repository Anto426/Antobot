async function statusupdate() {

    setInterval(async () => {
        if (bootstate) {
            let frasi = ["moderare il server", "/help"]
            var x = Math.floor(Math.random() * frasi.length);
            client.user.setActivity(frasi[x].toString());
        }
    }, 5000 * 60)

}
module.exports={statusupdate}