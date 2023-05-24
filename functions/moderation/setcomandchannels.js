async function setcommandchannel() {
    client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(x => {
            if (x.name.includes("command"))
                global.AllowCommands.push(x);
        })
    });
    console.log(AllowCommands.length);
    global.AllowCommands.forEach(x => {
        console.log(`Allow channel : ${x.name}, id: ${x.id}`)
    })

}
module.exports = {
    setcommandchannel
}