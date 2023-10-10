function replyin(interaction, content) {
    
    if (interaction.isChatInputCommand()) {
        interaction.reply(content);
    } else {
        interaction.update(content);
    }

}



module.exports = { replyin }