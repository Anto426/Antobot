async function remove(member, type) {
    temp = [];
    let file = `./Database/${member.guild.name}/${type}.json`
    fs.readFile(file, async function(err, content) {
        if (err) throw err;
        var parseJson = JSON.parse(content);
        for (let i = 0; i < parseJson.list.length; i++) {
            if (parseJson.list[i] != member.user.tag)
                temp.push(parseJson.list[i])
        }
        parseJson.list = temp
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })

    })

}
module.exports = {
    name: `guildMemberRemove`,
    async execute(member) {
        if (member.user.bot) {
            return
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Left")
                .setDescription(` ${member} ha abbandonati il server`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

            let channel = member.guild.channels.cache.find(x => x.id == configs[member.guild.name].stanze.left)
            channel.send({ embeds: [embed] }).catch(() => {})



            let directory = `./Database/${member.guild.name}`
            try {
                fs.lstatSync(directory).isDirectory()
                let type = "ticket"
                for (let i = 0; i < 2; i++) {
                    remove(member, type)
                    type = "room"
                }
                member.guild.channels.cache.forEach(channel => {
                    if (channel.topic == member.user.tag || channel.name.includes(member.user.tag)) {
                        channel.delete()
                    }
                });

                member.guild.roles.cache.forEach(role => {
                    if (role.name.includes(member.user.tag)) {
                        role.delete()
                    }
                });

            } catch (err) { console.log(err) }



        }


    }
};