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
        return new Promise((resolve, reject) => {
            const colorThief = new ColorThief();
            if (this.Img.complete) {
                resolve(colorThief.getPalette(this.Img, this.numColors));
            } else {
                this.Img.addEventListener('load', () => {
                    if (this.Img.naturalWidth > 0 && this.Img.naturalHeight > 0) {
                        console.log("Image loaded successfully");
                        resolve(colorThief.getPalette(this.Img, this.numColors));
                    } else {
                        reject("Image not loaded properly.");
                    }
                });
            }
        });
    }


    // Function to filter the palette
    filterPalette(palette) {
        return new Promise(async (resolve, reject) => {
            try {

                let sort = this.sortPalette(palette);
                let filtered = [...sort];

                if (this.requiredfilter) {

                    for (let i = 0; i < filtered.length; i++) {
                        let j = i + 1;
                        console.log(this.ColorFunctions.colorDistance(sort[i], sort[j]) > this.threshold);
                        if (this.ColorFunctions.colorDistance(sort[i], sort[j]) > this.threshold) {
                            filtered.splice(j, 1);
                            j--;
                        }
                    }
                }

                if (filtered.length === 0) {
                    reject("No colors left after filtering");
                } else {
                    console.log("Filtered Palette :", filtered);

                    resolve(filtered);
                }
            } catch (error) {
                reject(error);
            }
        });
    }


    sortPalette(palette) {
        let paletteCopy = [...palette];
        let sortp = paletteCopy.sort((a, b) => {
            return this.ColorFunctions.colorDistance([0, 0, 0], a) - this.ColorFunctions.colorDistance([0, 0, 0], b);
        });
        console.log("Original Palette :", palette);
        console.log("Sorted Palette :", sortp);
        return sortp;
    }


    calculateItem(palette) {
        const averageColor = this.ColorFunctions.averageColor(palette);
        let textColor = this.ColorFunctions.getOppositeColor(averageColor);
        let [h, s, l] = this.ColorFunctions.rgbToHsl(...textColor);
        l = l > 0.7 ? Math.max(0, l - 0.3) : l < 0.3 ? Math.min(1, l + 0.3) : l > 0.5 ? Math.max(0, l - 0.2) : Math.min(1, l + 0.2);
        textColor = this.ColorFunctions.hslToRgb(h, s, l);
        return textColor.map(color => Math.round(Math.min(255, Math.max(0, color))));
    }


    ReturnPalletandTextColor() {
        return new Promise((resolve, reject) => {
            this.ExtractPalet().then((palette) => {
                palette.length >= 3 ? null : this.requiredfilter = false;
                this.filterPalette(palette).then((newPalette) => {
                    this.updateGradient(newPalette).then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }


}


module.exports = { DynamicColor };