module.exports = {
    name: "repeat",
    permisions: [],
    allowedchannels: true,
    position: false,
    test: true,
    see: true,
    disTube: {
        checkchannel: true,
        checklisttrack: true
    },
    data: {
        name: "repeat",
        description: "ripeti la canzone",
        options: [{
            name: "mode",
            description: "mode",
            type: 3,
            required: true,
            choices: [{
                name: "off",
                value: "1"
            }, {
                name: "Song",
                value: "2"
            }, {
                name: "Queue",
                value: "3"
            },]
        }]
    },
    async execute(interaction, channels) {

        try {


        } catch (error) {
            console.error(error);
        }



    }
}