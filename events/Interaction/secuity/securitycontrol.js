const fs = require("fs");
const { genericerr, disablefunctionembed } = require("../../../embeds/err/generic");
const { notpermisionmsgerr, tohigtmsgerr, nottoyou } = require("../../../embeds/err/command/permission");

module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {
        try {
            if (!interaction.isChatInputCommand()) return;

            const command = client.commands.get(interaction.commandName)

            //Class
            class containers {
                constructor() {
                    this.owner = false;
                    this.sowner = false;
                    this.mowner = false
                    this.msowner = false;
                    this.mbot = false;
                    this.test = command.test;
                    this.staff = false;
                    this.perm = false;
                    this.you = false;
                    this.position = false;
                    this.channel = false
                    this.execute = false;
                }
            }

            let container = new containers


            //check interaction.author
            // owner
            try {
                const ow = require("./../../../settings/onwer.json")
                for (let i in ow.onwerid)
                    if (interaction.member.id == ow.onwerid[i]) {
                        container.owner = true
                    }
            } catch {
                console.log("errore non ho potuto controllare l'owner")
            }

            // sowner
            if (interaction.member.id == interaction.guild.ownerId) {
                container.sowner = true
            }

            //check interaction.member
            if (interaction.options.getMember("user")) {

                // owner
                try {
                    const ow = require("./../../../settings/onwer.json")
                    for (let i in ow.onwerid)
                        if (interaction.options.getMember("user").id == ow.onwerid[i]) {
                            container.mowner = true
                        }
                } catch {
                    console.log("errore non ho potuto controllare l'owner")
                }

                // sowner
                if (interaction.options.getMember("user").id == interaction.guild.ownerId) {
                    container.sowner = true
                }

                // bot id 
                if (interaction.options.getMember("user").id == client.id) {
                    container.bot = true
                }

                if (interaction.options.getMember("user").id == interaction.member.id) {
                    container.you = true
                }

            }

            if (container.test && !container.owner) {
                container.test = false
            }


            try {
                if (command.permisions.length == 0) {
                    container.perm = true
                } else {
                    command.permisions.forEach(per => {
                        if (interaction.member.permissions.has(per)) {
                            container.staff = true
                        }
                    });
                }
            } catch {
                console.log("errore non ho potuto controllare i permessi del comando")
                container.perm = true
            }


            if (command.position) {
                if (!container.owner && !container.sowner && container.staff) {
                    if (interaction.member.roles.highest.position > interaction.options.getMember("user").roles.highest.position)
                        container.position = true
                }
            } else {
                container.position = true
            }
            try {
                if (command.allowedchannels.length == 0) {
                    container.channel = true
                } else {
                    command.allowedchannels.forEach(chan => {
                        if (interaction.channel == chan) {
                            container.channel = true
                        }
                    })
                }
            } catch {
                console.log("errore non ho potuto controllare i canali del comando")
                container.channel = true
            }


            if (container.owner || container.sowner && !container.mowner && !container.msowner) {
                container.execute = true
            } else {
                if (container.staff || container.perm && container.channel && container.bot && container.you) {
                    if (container.position) {
                        container.execute = true
                    } else {
                        container.position = false
                    }
                }
            }

            try {
                if (container.execute && !container.owner) {
                    const commandsFiles = fs.readdirSync(`./commands/bot/`);
                    for (const file of commandsFiles) {
                        var commands2 = require(`./../../../commands/bot/${file}`);
                        if (commands2.name == command.name) {
                            container.execute = false
                        }
                    }
                }
            } catch { }


            if (container.execute && container.test) {
                try {
                    command.execute(interaction)
                } catch (err) {
                    genericerr(interaction, err)
                }
            } else {
                console.log(container.position)
                if (container.you)
                    return nottoyou(interaction)
                if (!container.position && container.staff)
                    return disablefunctionembed(interaction)

                if (!container.position && container.staff)
                    return tohigtmsgerr(interaction)
                return notpermisionmsgerr(interaction)

            }
        } catch (err) { genericerr(interaction, err) }
    }
}