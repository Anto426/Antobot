module.exports = {
    name: "messageCreate",
    async execute(message) {
        let trovato = false
        let trovato2 = false
        let commandsFolder = fs.readdirSync(`./Database/${message.guild.name}/`);
        for (let folder of commandsFolder) {
            let file = `./Database/${message.guild.name}/${folder}`
            let content = fs.readFileSync(file)
            var parseJson = JSON.parse(content)
            parseJson.list.forEach(async x => {
                for (let y in x) {
                    if (message.member.id == x[y]) {
                        trovato = true
                    }
                    if (trovato && message.channel.id == x[y]) {
                        trovato2 = true
                    }
                }
                if (trovato && trovato2) {
                    x.lasttimestamp = message.createdTimestamp
                    await fs.writeFile(file, JSON.stringify(parseJson), function(err) {
                        if (err) throw err;
                    })
                }
            })

        }


    }

}