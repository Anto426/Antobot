async function activity() {

    let frasi = [" moderare il server", "/help"]
    var x = Math.floor(Math.random() * frasi.length);
    client.user.setActivity(frasi[x].toString());

}

function msgcontroll() {
    
}

module.exports = {
    activity: activity
}