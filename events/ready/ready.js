const configs = require("./../../index")
module.exports = {
    name: "ready",
    async execute() {

        console.log(`
        
        logged to ${configs.client.user.tag}

        Numbers Guils : ${configs.client.guilds.cache.size}

        `)
        configs.client.user.setStatus("online")

        try {
            configs.client.guilds.cache.forEach(guild => {
                configs.client.commands.forEach(command => {
                    guild.commands.create(command.data)

                })
            })


        } catch (err) {
            console.error(err)
        }
    }



}