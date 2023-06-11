const { congratulatioembed } = require("../../embeds/hollyday/hollydayembed");
const { times } = require("../time/timef")
const cguild = require("./../../settings/guild.json")
const chollyday = require("./../../settings/hollyday.json")


function nexhollyday() {

    try {
        let cont = 0, check = false, x = {}
        do {
            if (new Date().getTime() < new Date(new Date().getFullYear(), chollyday.holidays[cont].date.mouth, chollyday.holidays[cont].date.day)) {
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
        do {
            setTimeout(() => {
                var timereminig = new Date(new Date().getFullYear(), festa.date.mouth, festa.date.day) - new Date().getTime()
                let time = `${times(timereminig)}`
                console.log(`Update : ${time}`)
                channelcount.setName(time.toString()).catch((err) => { console.log(err.toString()) })
                return

            }, 1000 * 60 * 5)
        } while (timereminig > 0)
    } catch { }

}

async function sendcongratulations(festa) {

    do {
        setTimeout(() => {
            var timereminig = new Date(new Date().getFullYear(), festa.date.mouth, festa.date.day) - new Date().getTime()
            if (timereminig <= 0) {
                console.log(festa.title)
                congratulatioembed(festa)
                mainhollyday()
                return
            }
        }, 1000 * 60)
    } while (timereminig > 0)
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

        countInterval = updatecount(festa.date, channelcount);
        congratulationsInterval = sendcongratulations(festa);

    } catch { }


}



module.exports = {
    mainhollyday
}