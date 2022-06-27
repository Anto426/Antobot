async function remove(interaction, type) {
    temp = [];
    let file = `./Database/${interaction.guild.name}/${type}.json`
    fs.readFile(file, async function(err, content) {
        if (err) throw err;
        var parseJson = JSON.parse(content);
        for (let i = 0; i < parseJson.list.length; i++) {
            if (parseJson.list[i] != interaction.channel.topic)
                temp.push(arr[i])
        }
        parseJson.list = temp
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })
    })

}
module.exports = {
    name: "cremove",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "cremove",
        description: "rimuove utente dalla stanza privata",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: "USER",
            required: true
        }]
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