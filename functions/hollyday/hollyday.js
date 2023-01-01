const hollyday = require("./../../setting/hollyday.json")
const { times } = require("../time/timef")
const Discord = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")


async function nexhollyday() {

    let i = 0, z = 0, timenow = 0, timenextholl = 0, festa
    while (i == 0) {
        timenow = new Date().getTime()
        timenextholl = new Date(hollyday.holidays[z].date).getTime()
        if (timenow < timenextholl) {
            festa = hollyday.holidays[z]
            i++

        }
        z++
    }
    return festa

}



async function updatechannel() {

    let festa = await nexhollyday()

    let timenexthollyday = new Date(festa.date).getTime()
    setInterval(async () => {
        let timenow = new Date().getTime()
        let timereminig = timenexthollyday - timenow
        let time = await `${times(timereminig)}`
        client.guilds.cache.forEach(async guild => {
            guild.channels.cache.get(cguild[guild.name].channel.hollyday.nexthollyday).setName(time.toString()).catch((err) => { console.log(err) })
        })
    }, 1000 * 60 * 5);

}


async function mainhollyday() {
    let festa = await nexhollyday()
    client.guilds.cache.forEach(async guild => {
        guild.channels.cache.get(cguild[guild.name].channel.hollyday.name).setName(`${festa.name.toString()}:`).catch((err) => { console.log(err) })
    })
    let timenextholl = new Date(festa.date).getTime()
    updatechannel()
    setInterval(() => {
        timenow = new Date().getTime()
        let timereminig = timenextholl - timenow
        client.guilds.cache.forEach(async guild => {
            let time = await `${festa.name}:${times(timereminig)}`
            console.log(time)
            if (timereminig <= 0) {
                console.log(festa.phrase)
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Buone Feste")
                    .setDescription(`
'@everyone'
${festa.phrase}
`)
                    .setThumbnail(festa.image)
                    .setColor(cembed.color["Gold Fusion"])
                guild.channels.cache.get(cguild[guild.name].channel.serverinfo.annunce).send({ embeds: [embed] })
                mainhollyday()
            }
        })

    }, 1000 * 60)

}



module.exports = {
    mainhollyday
}

