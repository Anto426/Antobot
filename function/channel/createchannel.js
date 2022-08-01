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