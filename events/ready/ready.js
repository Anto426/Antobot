module.exports = {
    name: "ready",
    async execute() {

        console.log(`
        
        logged to ${client.user.tag}

        Numbers Guils : ${client.guilds.cache.size}

        `)
        client.user.setStatus("online")

        try {
            client.guilds.cache.forEach(guild => {
                client.commands.forEach(command => {
                    guild.commands.create(command.data)

                })
            })


        } catch (err) {
            console.error(err)
        }
    }



}