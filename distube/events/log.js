module.exports = {
    name: "log ffmpeg",
    typeEvent: "ffmpegDebug",
    allowevents: true,
    async execute(debug) {
        console.log(debug);
    }
}