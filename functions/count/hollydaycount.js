const { congratulatioembed } = require("../../embeds/hollyday/hollyday");
const { times } = require("../time/timef")
const cguild = require("./../../settings/guild.json")
const chollyday = require("./../../settings/hollyday.json")


function nexhollyday() {

    try {
        let cont = 0, check = false, x = {}
        do {
            if (new Date().getTime('it-IT', optionsdate) < new Date(new Date().getFullYear(), chollyday.holidays[cont].date.mouth, chollyday.holidays[cont].date.day)) {
                x = chollyday.holidays[cont]
                check = true
            }
            cont++;
        } while (!check);
        return x
    } catch { }
}

async function updatecount(festa, channelcount) {

    try {
        setInterval(async () => {
            let timereminig = new Date(new Date().getFullYear(), festa.mouth, festa.day) - new Date().getTime('it-IT', optionsdate)
            let time = await `${times(timereminig)}`
            console.log(`Update : ${time}`)
            channelcount.setName(time.toString()).catch((err) => { console.log(err.toString()) })
        }, 1000 * 60 * 5);
    } catch { }

}

async function sendcongratulations(festa) {
    setInterval(() => {

        let timereminig = new Date(new Date().getFullYear(), festa.date.mouth, festa.date.day) - new Date().getTime('it-IT', optionsdate)
        if (timereminig <= 0) {
            console.log(festa.title)
            congratulatioembed(festa)
            return mainhollyday()
        }



    }, 1000 * 60)
}

async function mainhollyday() {

    try {
        const guild = await client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id)
        const channelname = guild.channels.cache.find(x => x.id == cguild["Anto's  Server"].channel.hollyday.name)
        const channelcount = guild.channels.cache.find(x => x.id == cguild["Anto's  Server"].channel.hollyday.count)
        let festa = nexhollyday()

        if (!guild || !channelname || !channelcount || !festa)
            return
        channelname.setName(festa.name)
            .then(updatedChannel => console.log(`Il nome del canale è stato aggiornato a ${updatedChannel.name}`))
            .catch(console.error);
        updatecount(festa.date, channelcount)
        sendcongratulations(festa)
    } catch { }


}



module.exports = {
    mainhollyday
}