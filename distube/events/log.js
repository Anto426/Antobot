module.exports = {
    name: "log ffmpeg",
    typeEvent: "ffmpegDebug",
    allowevents: false,
    async execute(debug) {
         
        console.log(debug);
    }
}