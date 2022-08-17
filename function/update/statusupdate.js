
async function activity() {

    let frasi = [" moderare il server", "/help"]
    var x = Math.floor(Math.random() * frasi.length);
    configs.client.user.setActivity(frasi[x].toString());

}



module.exports = {
    activity: activity
}