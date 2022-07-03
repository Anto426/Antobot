async function remove(interaction, type) {
    temp = [];
    let file = `./Database/${interaction.guild.name}/${type}.json`
    fs.readFile(file, async function(err, content) {
        if (err) throw err;
        var parseJson = JSON.parse(content);
        for (let i = 0; i < parseJson.list.length; i++) {
            if (parseJson.list[i] != interaction.channel.topic)
                temp.push(parseJson.list[i])
        }
        parseJson.list = temp
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })
    })

}
module.exports = {
    name: "cdelete",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "cdelete",
        description: "Elimina stanza privata"
    },
    execute(interaction) {


        remove(interaction, "room")


        interaction.guild.channels.cache.forEach(channel => {
            if (channel.topic == interaction.member.user.tag || channel.name.includes(interaction.member.user.tag)) {
                channel.delete()
            }
        });

        interaction.guild.roles.cache.forEach(role => {
            if (role.name.includes(interaction.member.user.tag)) {
                role.delete()
            }
        });


    }
}