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
 async function createchannel(interaction, channelname, type, category, type2) {
     try {
         let channel = await interaction.guild.channels.create(channelname, {
             type: type,
             parent: category,
             topic: interaction.member.user.tag,
             permissionOverwrites: [{
                 id: interaction.member.id,
                 allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
             }, {
                 id: interaction.member.guild.roles.everyone,
                 deny: ["VIEW_CHANNEL"]
             }]
         })
         if (type2) {
             let embed = new Discord.MessageEmbed()
                 .setTitle("hey ciao ci dispiace che hai avuto problemi!")
                 .setDescription("<@" + interaction.member + ">" + " tiket creato con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes() + " attendi che lo staff ti risponda")
                 .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                 .setColor(configs.embed.color.green)
             let row = new Discord.MessageActionRow()
                 .addComponents(
                     new Discord.MessageButton()
                     .setCustomId('closedtiket')
                     .setStyle('DANGER')
                     .setLabel('chiudi il ticket'),
                 );
             channel.send({ embeds: [embed], components: [row] })

         } else {
             if (channel.type == "GUILD_TEXT") {
                 const embed = new Discord.MessageEmbed()
                     .setTitle("hey ciao ")
                     .setDescription("<@" + interaction.member + ">" + " stanza creata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes() +
                         `\`\`\`js\n 
puoi usare i seguenti comandi per:
1) cdelete "per cancellare la stanza"
2) cadd "per aggiungere membri alla stanza"
3) cremove "per rimuovere un membro"
                 \`\`\``)
                     .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                     .setColor("#51ff00")
                 let row = new Discord.MessageActionRow()
                     .addComponents(
                         new Discord.MessageButton()
                         .setCustomId('closedroom')
                         .setStyle('DANGER')
                         .setLabel('elimina stanze'),
                     );

                 channel.send({ embeds: [embed], components: [row] })
             }
         }
     } catch (err) { console.log(err) }
 }

 async function dir(interaction) {

     let directory = `./Database/${interaction.guild.name}`
     try {
         fs.lstatSync(directory).isDirectory()
     } catch {
         const path = require('path');


         fs.mkdir(path.join(`./Database/`, interaction.guild.name), (err) => {
             if (err) {
                 return console.log(err);
             }
             console.log('Directory created successfully!');
         });
     }
 }

 async function write(interaction, type) {
     let file = `./Database/${interaction.guild.name}/${type}.json`
     const name = interaction.member.user.tag
     var trovata = false
     try {
         fs.statSync(file).isFile()


         let content = fs.readFileSync(file)
         var parseJson = JSON.parse(content)
         for (number in parseJson.list) {
             if (parseJson.list[number] == name) {
                 trovata = true

             }
         }
         console.log(trovata)
         if (trovata) {
             let embed = new Discord.MessageEmbed()
                 .setTitle("Error")
                 .setDescription("Impossibile aprire la stanza ne hai già una")
                 .setColor(configs.embed.color.red)
                 .setThumbnail("https://i.imgur.com/5dNAgln.gif")
             interaction.reply({
                 embeds: [embed],
                 ephemeral: true
             })

         }


         if (!trovata) {
             fs.readFile(file, async function(err, content) {
                 if (err) throw err;
                 var parseJson = JSON.parse(content)
                 a = true
                 parseJson.list.push(name)
                 fs.writeFile(file, JSON.stringify(parseJson), function(err) {
                     if (err) throw err;
                 })
             })
             if (type == "ticket") {
                 let embed1 = new Discord.MessageEmbed()
                     .setTitle("tiket creato")
                     .setDescription("ticket creato con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes() + " attendi che lo staff ti risponda")
                     .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                     .setColor(configs.embed.color.green)
                 interaction.reply({
                     embeds: [embed1],
                     ephemeral: true
                 })
             }
             if (type == "room") {
                 let embed1 = new Discord.MessageEmbed()
                     .setTitle("stanza creata")
                     .setDescription("stanza creata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                     .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                     .setColor(configs.embed.color.green)
                 interaction.reply({
                     embeds: [embed1],
                     ephemeral: true
                 })

             }
         }

     } catch (err) {
         console.log(err)
         let parseJson = {
             "list": [name]
         }
         fs.writeFile(file, JSON.stringify(parseJson), function(err) {
             if (err) throw err;
         })

     }






     return trovata



 }
 module.exports = {
     name: "interactionCreate",
     async execute(interaction) {

         if (interaction.customId == "deletechat") {
             interaction.channel.delete()

         }

         if (interaction.customId == "mc") {
             for (server in configs.game.mc) {
                 let embed = new Discord.MessageEmbed()
                     .setColor('#0099ff')
                     .setTitle("Ecco il tuo server")

                 if (interaction.values[0] == server) {
                     console.log(server)
                     embed.setThumbnail(configs.game.mc[server].images)
                     embed.setDescription(configs.game.mc[server].server);
                     interaction.reply({ embeds: [embed] })
                     setTimeout(() => interaction.deleteReply(), 10000)

                 }
             }



         }




         if (interaction.customId == "opentiket") {
             dir(interaction)
             await write(interaction, "ticket").then(async(a) => {
                 if (!a) {
                     let category = client.channels.cache.get(configs[interaction.guild.name].stanze.tiket)
                     let channelname = "「🎫」" + interaction.member.user.tag.toString()
                     createchannel(interaction, channelname, "GUILD_TEXT", category, true)
                 }

             })
         }

         if (interaction.customId == "closedtiket") {
             remove(interaction, "ticket")
             interaction.channel.delete()
             return



         }

         if (interaction.customId == "onlytext" || interaction.customId == "onlyvoice" || interaction.customId == "text+voice") {
             dir(interaction)
             await write(interaction, "room").then(async(a) => {
                 if (!a) {
                     const category = interaction.guild.channels.cache.find(x => x.name == "🔐Stanze private🔐")
                     let channelname = ""
                     let tipe = ""
                     let channel = ""
                     if (interaction.customId == "onlytext") {
                         tipe = "GUILD_TEXT"
                         channelname = "「💭」" + interaction.member.user.tag
                         createchannel(interaction, channelname, tipe, category, false)
                     }
                     if (interaction.customId == "onlyvoice") {
                         tipe = "GUILD_VOICE"
                         channelname = "「🔊」" + interaction.member.user.tag
                         createchannel(interaction, channelname, tipe, category, false)
                     }
                     if (interaction.customId == "text+voice") {
                         tipe = "GUILD_TEXT"
                         channelname = "「💭」" + interaction.member.user.tag
                         for (let i = 0; i < 2; i++) {
                             createchannel(interaction, channelname, tipe, category, false)
                             tipe = "GUILD_VOICE"
                             channelname = "「🔊」" + interaction.member.user.tag
                         }
                     }
                     let role = await interaction.guild.roles.create({
                         name: `private room ${interaction.member.user.tag}`,
                     })
                     interaction.member.roles.add(role)
                 }

             })


         }

         if (interaction.customId == "closedroom") {

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




 }