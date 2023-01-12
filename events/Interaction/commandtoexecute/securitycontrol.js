const { EmbedBuilder } = require("discord.js")
const { consolelog } = require("../../../functions/log/console/consolelog")
const fs = require("fs")
const cembed = require("./../../../setting/embed.json")
module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {
        let owner = false, sowner = false, staff = false, perm = false, channel = false, position = false, execute = false
        const command = client.commands.get(interaction.commandName)
        const ow = require("./../../../setting/onwer.json")

        // owner
        for (let i in ow.onwerid)
            if (interaction.member.id == ow.onwerid[i]) {
                owner = true
            }


        // sowner
        if (interaction.member.id == interaction.guild.ownerId) {
            sowner = true
        }


        if (command.permisions.length == 0) {
            perm = true
        } else {
            command.permisions.forEach(per => {
                if (interaction.member.permissions.has(per)) {
                    staff = true
                }
            });
        }

        if (interaction.options.getMember("user")) {
            if (!owner && !sowner && staff) {
                if (interaction.member.roles.highest.position > interaction.options.getMember("user").roles.highest.position)
                    position = true
            }
        } else {
            position = true
        }

        if (command.allowedchannels.length == 0) {
            channel = true
        } else {
            command.allowedchannels.forEach(chan => {
                if (interaction.channel == chan) {
                    channel = true
                }
            })
        }

        if (owner || sowner) {
            if (!owner && sowner) {
                execute = true
            }
        }


        if (staff || perm && channel && position) {
            execute = true
        }

        if (execute) {
            const commandsFiles = fs.readdirSync(`./commands/bot/`);
            for (const file of commandsFiles) {
                var commands2 = require(`./../../../commands/bot/${file}`);
                if (commands2.name == command.name) {
                    execute = false
                }
            }
        }
        console.log("Owner:" + owner, "Sowner:" + sowner, "Staff:" + staff, "Per:" + perm, "Channel:" + channel, "position:" + position, "execute:" + execute)
        if (execute) {
            try {
                command.execute(interaction)
            } catch (err) {
                let description = ["Ho avuto dei problemi durante l'esecuzione del comando", "Riprova più tardi sarai più fortunato", "Opps Qualcosa è andato storto"]
                var x = Math.floor(Math.random() * description.length);
                let embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(description[x])
                    .setColor(cembed.color.Red)
                    .setThumbnail(cembed.immage.err)
                interaction.reply({ embeds: [embed], ephemeral: true })
                consolelog(err.toString())
            }
        } else {
            let description = ["Non hai i permessi necessari per eseguire questo comando"]
            var x = Math.floor(Math.random() * description.length);
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(description[x])
                .setColor(cembed.color.Black)
                .setThumbnail(cembed.immage.accesdenied)
            interaction.reply({ embeds: [embed], ephemeral: true })

        }
    }
}
