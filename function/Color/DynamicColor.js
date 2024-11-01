const ColorThief = require('colorthief');
const { ColorFunctions } = require('./ColorFunctions');
const { BotConsole } = require('../log/botConsole');
class DynamicColor {

    constructor() {
        this.Img;
        this.Numcolorextract = 4;
        this.threshold = 50;
        this.Palette = [];
        this.ColorFunctions = new ColorFunctions();
        this.botconsole = new BotConsole();
    }


    setImg(img) {
        this.Img = img;
    }

    setImgUrl(url) {
        return new Promise((resolve, reject) => {
            this.botconsole.log("Fetching image from url: " + url, "green");
            fetch(url)
                .then(async response => {
                    if (!response.ok) {
                        reject("Error fetching image: " + response.statusText);
                    } else {
                        return await response.arrayBuffer(); 
                    }
                })
                .then(buffer => {
                    this.Img = Buffer.from(buffer); 
                    resolve(0); 
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                    reject(error); 
                });

        });
    }


    setThreshold(threshold) {
        this.threshold = threshold;
    }


    setNumcolorextract(Numcolorextract) {
        this.Numcolorextract = Numcolorextract;
    }

    // Function for extract the palette
    ExtractPalet() {
        return new Promise(async (resolve, reject) => {
            if (this.Img) {
                console.log("Image loaded properly.");
                this.Palette = await ColorThief.getPalette(this.Img, this.Numcolorextract);
                resolve(this.Palette);
            } else {
                reject("Image not loaded properly.");
            }
        });
    }


    // Function for filter the palette
    FilterPalet() {

        return new Promise((resolve, reject) => {
            const filtered = [];

            for (let i = 0; i < this.Palette.length; i++) {
                let addColor = true;
                for (let j = 0; j < filtered.length; j++) {
                    if (this.ColorFunctions.colorDistance(this.Palette[i], filtered[j]) < this.threshold) {
                        addColor = false;
                        break;
                    }
                }
                if (addColor) {
                    filtered.push(this.Palette[i]);
                }
            }
            if (filtered.length === 0) {
                reject("No colors left after filtering");
            } else {
                this.SortPalet(filtered);
                resolve(0);
            }
        })

    }


    // Function for sort the palette in base of the tone
    SortPalet() {
        return new Promise((resolve, reject) => {
            try {
                this.Palette = this.Palette.sort((a, b) => {
                    const hslA = this.ColorFunctions.rgbToHsl(a[0], a[1], a[2]);
                    const hslB = this.ColorFunctions.rgbToHsl(b[0], b[1], b[2]);
                    return hslA[0] - hslB[0];
                });
                resolve(0);
            } catch (error) {
                reject(error);
            }
        })

    }


    // Function for calculate the text color
    CalculateTextcolor() {
        let textcolor = this.ColorFunctions.getOppositeColor(this.ColorFunctions.averageColor(this.Palette));
        let hsl = this.ColorFunctions.rgbToHsl(textcolor[0], textcolor[1], textcolor[2]);
        if (hsl[2] > 0.5) {
            textcolor = textcolor.map(color => color - 30);
        }
        return textcolor;
    }


    ReturnPalletandTextColor() {
        return new Promise((resolve, reject) => {
            this.ExtractPalet().then(() => {
                this.FilterPalet().then(() => {
                    resolve({ palette: this.Palette, textcolor: this.CalculateTextcolor() });
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
    }


}


module.exports = { DynamicColor };