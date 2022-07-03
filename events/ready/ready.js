module.exports = {
    name: "ready",
    async execute() {

        console.log(`logged sucess in  ${client.user.tag} 😊`)
        client.user.setActivity("moderare questo server 😊", {
            type: "PLAYING",
        });
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