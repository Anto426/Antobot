const cembed = require("../../../setting/embed.json")
async function consolelog(content, type, other) {
    let title
    let contentmsg
    let immage
    let color
    console.log(content)
    switch (type) {
        case 0:
            title = "Errore riscontrato"
            contentmsg = [
                { name: "Modulo", value: `\`\`\`\n${other}\`\`\`` },
                { name: "Ora", value: `\`\`\`\n${timenow.toLocaleDateString("it")}\`\`\`` },
                { name: "Err", value: `\`\`\`\n${other.err}\`\`\`` },
            ]
            immage = cembed.immage.err
            color = cembed.color.Red
            break;
        case 1:
            title = "Nuovo Utente"
            contentmsg = [
                { name: "Ora", value: `\`\`\`\n${timenow.toLocaleDateString("it")}\`\`\`` },
                { name: "Utente", value: `\`\`\`\nName:${other.err},id:${other.err}\`\`\`` },
                { name: "Creazione Account", value: `\`\`\`\nName:${other.member},id:${other.err}\`\`\`` },
            ]
            color = cembed.color.Green
            immage = other
            break;
        case 2:
            title = "Utente Uscito"
            contentmsg = [
                { name: "Ora", value: `\`\`\`\n${timenow.toLocaleDateString("it")}\`\`\`` },
                { name: "Utente", value: `\`\`\`\nName:${other.err},id:${other.err}\`\`\`` },
                { name: "Creazione Account", value: `\`\`\`\nName:${other.member},id:${other.err}\`\`\`` },
            ]
            color = cembed.color.Green
            immage = other
            break;
        case 3:
            title = "Comando eseguito"
            contentmsg = [
                { name: "Ora", value: `\`\`\`\n${timenow.toLocaleDateString("it")}\`\`\`` },
                { name: "Utente", value: `\`\`\`\nName:${other.err},id:${other.err}\`\`\`` },
                { name: "Creazione Account", value: `\`\`\`\nName:${other.member},id:${other.err}\`\`\`` },
            ]
            color = cembed.color.Green
            immage = cembed.immage.
            break;
        case 4:

            break;
        case 5:

            break;
        case 6:

            break;

        default:
            break;
    }
}

module.exports = {
    consolelog
}