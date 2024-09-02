module.exports = {
    name: "log ffmpeg",
    typeEvent: "ffmpegDebug",
    async execute(debug) {
        console.log(debug);
    }
}