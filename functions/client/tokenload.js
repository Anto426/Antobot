const fs = require("fs")
const prompt = require('prompt-sync')();
const { boot } = require("./boot");
const { inspect } = require(`util`);
const { intclient } = require("./intclient");
const patch = "./.env"
async function rep() {
    console.log(`
-Client Name : ${client.user.username}

-Client id : ${client.user.id}
`)
    let scelta = prompt('This is your client y/n/e:');
    switch (scelta.toLowerCase()) {
        case "y":
            console.log("Client loading ....")
            boot()
            break;
        case "n":
            console.log("Client reloading....")
            fs.unlinkSync(patch);
            client.destroy()
            await intclient()
            tokenload(false)
            break;
        case "e":
            console.log("Interrupt....")
            client.destroy()
            break;
        default:
            console.log("Err: Input non valid!")
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