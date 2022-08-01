async function createchannel(interaction, channelname, type, category, id ,allow, deny, alloweveryone ,denyeveryone ,topic ) {
    try {
        var channel = await interaction.guild.channels.create(channelname, {
            type: type,
            parent: category,
            topic: topic,
            permissionOverwrites: [{
                id: id,
                allow: allow,
                deny : deny
            }, {
                id: interaction.member.guild.roles.everyone,
                allow: alloweveryone ,
                deny: denyeveryone
            }]
        })
    }catch{

    }
    return channel 
}

function verificchannel(idorname,interaction){
    let channel = interaction.guild.channels.find(x => x.id || x.name)
    if(!channel) {
        let embed = new Discord.EmbedBuilder()
        .setTitle("Erroor")
        .setImage(configs.embed.image.error)
        .setColor(configs.embed.color.red)
        .setDescription("Error non ho trovaato il canale")
        return false  
    }
    return true 
}