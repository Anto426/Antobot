const fs = require("fs")
const prompt = require('prompt-sync')();
const { boot } = require("./boot");
const { inspect } = require(`util`)
const patch = "./.env"
function rep() {
    console.log(`
-Client Name : ${client.user.username}

-Client id : ${client.user.id}
`)
    let scelta = prompt('This is your client y/n:');
    switch (scelta) {
        case "y" || "Y":
            console.log("Client loading ....")
            boot()
            break;
        case "n" || "N":
            console.log("Interrupt....")
            fs.unlinkSync(patch);
            tokenload(false)
            break;
        default:
            rep()
            break;
    }

}
async function tokenload(token) {

    client.login(token)
        .then(() => {
            rep()

        })
        .catch((err) => {
            console.log(`Error:${inspect((err.toString()))} `)
            const temp = prompt('Inser here new token:');
            console.log(`New token: ${temp}`);
            let content = `TOKEN=${temp}`
            fs.writeFile(patch, content.toString(), () => { })
            tokenload(temp)
        })


}






module.exports = {
    tokenload
}