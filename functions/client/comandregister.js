function comandregister() {

    client.guilds.cache.forEach(guild => {
        console.log("I'm writinig " + client.commands.size + " in " + guild.name)
        client.commands.forEach(command => {
            guild.commands.create(command.data).catch((err) => { console.log(err) })

        })
    })


}
module.exports= {
    comandregister
}