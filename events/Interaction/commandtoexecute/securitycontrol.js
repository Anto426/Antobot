const fs = require("fs")
const errmsg = require("./../../../functions/msg/errormsg")
module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        let owner = false, sowner = false, staff = false, perm = false, channel = false, position = false, test = true, execute = false
        try {
            const command = client.commands.get(interaction.commandName)
            const ow = require("./../../../setting/onwer.json")
            const cguild = require("./../../../setting/guild.json")

            // owner
            for (let i in ow.onwerid)
                if (interaction.member.id == ow.onwerid[i])
                    owner = true



            // sowner
            if (interaction.member.id == interaction.guild.ownerId)
                sowner = true


            if (command.test && !owner)
                test = false

            if (command.permisions.length == 0)
                perm = true
            else {
                command.permisions.forEach(per => {
                    if (interaction.member.permissions.has(per)) {
                        perm = true
                    }
                });
            }


            for (let i in cguild[interaction.guild.name].role.staff)
                if (interaction.member.roles.cache.find(x => x.id == cguild[interaction.guild.name].role.staff[i]))
                    staff = true

            if (command.position) {
                if (!owner && !sowner && staff) {
                    if (interaction.member.roles.highest.position > interaction.options.getMember("user").roles.highest.position)
                        position = true
                }
            } else {
                position = true
            }

            if (command.allowedchannels.length == 0)
                channel = true
            else {
                command.allowedchannels.forEach(chan => {
                    if (interaction.channel == chan.id) {
                        channel = true
                    }
                })
            }

            if (owner || sowner)
                execute = true




            if (staff || perm && channel) {
                if (position)
                    execute = true
            }

            if (execute && !owner) {
                const commandsFiles = fs.readdirSync(`./commands/bot/`);
                for (const file of commandsFiles) {
                    var commands2 = require(`./../../../commands/bot/${file}`);
                    if (commands2.name == command.name) {
                        execute = false
                    }
                }
            }
            console.log("Owner:" + owner, "Sowner:" + sowner, "Staff:" + staff, "Per:" + perm, "Channel:" + channel, "position:" + position, "test:" + !test, "execute:" + execute)
            if (execute && test) {
                try {
                    command.execute(interaction)
                } catch (err) {
                    errmsg.genericmsg(interaction)
                }
            } else {
                if (!test)
                    return errmsg.disablefunction(interaction)
                if (!position && staff)
                    return errmsg.tohigtmsg(interaction)
                return errmsg.notpermisionmsg(interaction)
            }
        } catch (err) {
            errmsg.genericmsg(interaction);
            console.log(err)
        }
    }
}
