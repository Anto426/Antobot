const hollyday = require("./../../setting/hollyday.json")
const { times } = require("../time/timef")
const Discord = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")

async function nexhollyday() {

    let i = 0, z = 0, timenextholl = 0, festa
    while (i == 0) {
        timenextholl = new Date(hollyday.holidays[z].date).getTime()
        if (timenow < timenextholl) {
            festa = hollyday.holidays[z]
            i++

        }
        z++
    }
    return festa

}



async function updatechannel(guild) {

    let festa = await nexhollyday()

    let timenexthollyday = new Date(festa.date).getTime()
    setInterval(async () => {
        console.log("Update")
        let timereminig = timenexthollyday - timenow
        let time = await `${times(timereminig)}`
        console.log(`Update : ${time}`)
        guild.channels.cache.get(cguild[guild.name].channel.hollyday.nexthollyday).setName(time.toString()).catch((err) => { console.log(err.toString()) })
    }, 1000 * 60 * 5);

}


async function mainhollyday() {
    let guild = await client.guilds.cache.get(cguild["Anto's  Server"].id)
    let festa = await nexhollyday()
    guild.channels.cache.get(cguild[guild.name].channel.hollyday.name).setName(`${festa.name.toString()}:`).catch((err) => { console.log(err.toString()) })
    let timenextholl = new Date(festa.date).getTime()
    updatechannel(guild)
    setInterval(() => {

        let timereminig = timenextholl - timenow
        client.guilds.cache.forEach(async guild => {
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

