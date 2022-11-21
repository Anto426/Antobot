const { client } = require("./../../../index");
const configs = require("./../../../index")
module.exports = {
    name: "ready",
    async execute() {

        let command = []

        configs.client.commands.forEach(x => {
            command.push(x.name + "\n")
        });


        let embed = new configs.Discord.EmbedBuilder()
            .setTitle("Bot avviato con successo")
            .setDescription("Bot avviato con successo")
            .setColor(configs.settings.embed.color.green)
            .addFields(
                { name: "Date:", value: `\`\`\`\n${new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear() + "\n" + new Date().getHours() + ":" + new Date().getMinutes()}\`\`\`` },
                { name: "N. Guild:", value: `\`\`\`\n${configs.client.guilds.cache.size}\`\`\`` },
                { name: "Ping:", value: `\`\`\`\n${configs.client.ws.ping}ms\`\`\`` },
                { name: "Command load:", value: `\`\`\`\n-${command.join("-")}\`\`\`` },
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true })
            )


        configs.guildrepo.status.send({ embeds: [embed] })

    }
}