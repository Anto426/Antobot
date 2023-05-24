const { Client, Partials } = require('discord.js');
const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { YtDlpPlugin } = require('@distube/yt-dlp');


async function intclient() {
    global.client = new Client({
        intents: 3276799,
        partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.Channel]
    });
    global.distube = new DisTube(client, {
        leaveOnStop: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        plugins: [
            new SpotifyPlugin({
                emitEventsAfterFetching: true
            }),
            new SoundCloudPlugin(),
            new YtDlpPlugin()
        ]
    })
}

module.exports = {
    intclient
}