async function activity() {

    let cane = [" moderare il server", "/help"]
    var dio = Math.floor(Math.random() * cane.length);
    client.user.setActivity(cane[dio].toString());

}

function msgcontroll() {
    
}

module.exports = {
    activity: activity
}