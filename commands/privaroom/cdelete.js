module.exports = {
    name: "cdelete",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "cadd",
        description: "aggiungi utente dalla stanza privata",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: "USER",
            required: true
        }]
    },
    execute(interaction) {


    }
}