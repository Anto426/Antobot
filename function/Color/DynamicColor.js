const ColorThief  = require('colorthief');
const { ColorFunctions } = require('./ColorFunctions');
class DynamicColor {


    constructor() {
        this.Img;
        this.threshold = 50;
        this.Palette = [];
        this.ColorFunctions = new ColorFunctions();
    }


    setImg(img) {
        this.Img = img;
    }

    setThreshold(threshold) {
        this.threshold = threshold;
    }



    // Function for extract the palette
    ExtractPalet() {
        return new Promise((resolve, reject) => {
            let Numcolor = 3;
            if (this.Img.complete) {
                this.Palette = ColorThief.getPalette(this.Img, Numcolor);
                resolve(0);
            } else {
                this.Img.addEventListener('load', () => {
                    if (this.Img.naturalWidth > 0 && this.Img.naturalHeight > 0) {
                        console.log("Image loaded successfully");
                        this.Palette = ColorThief.getPalette(this.Img, Numcolor);
                        resolve(0);
                    } else {
                        reject("Image not loaded properly.");
                    }
                });
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




    // Function for update the gradient and the text color
    UpdateGradient() {
        return new Promise((resolve, reject) => {
            try {
                let textcolor = this.CalculateTextcolor();
                console.log("New Palette color :");
                console.log(this.Palette);
                console.log("New Text color " + textcolor);

                const paletteColors = this.Palette.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
                document.documentElement.style.setProperty('--default-item-color', this.ColorFunctions.ArrayToRgb(textcolor));
                document.documentElement.style.setProperty('--default-bg-gradient', `linear-gradient(to right, ${paletteColors.join(', ')})`);
                resolve(0);
            } catch (error) {
                reject(error);
            }

        });

    }


    // Function for apply the theme
    applyTheme() {
        return new Promise((resolve, reject) => {
            this.ExtractPalet().then(() => {
                this.FilterPalet().then(() => {
                    this.UpdateGradient().then(() => {
                        resolve(0);
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                    console.error(error);
                });
            }).catch(error => {
                reject(error);
                console.error(error);
            });

        });

    }


}


module.exports = { DynamicColor };