class ColorFunctions {

    // Function for convert RGB to HSL
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h, s, l];
    }
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    


    averageColor(color) {
        let somme = { r: 0, g: 0, b: 0 };
        color.forEach(element => {
            somme.r += element[0];
            somme.g += element[1];
            somme.b += element[2];
        });

        somme.r = Math.round(somme.r / color.length);
        somme.g = Math.round(somme.g / color.length);
        somme.b = Math.round(somme.b / color.length);



        return [somme.r, somme.b, somme.g];
    }



    // Function for calculate the distance between two colors
    colorDistance(color1, color2) {
        let difRgb = this.diffColor(color1, color2);
        return Math.sqrt(Math.pow(difRgb[0], 2) + Math.pow(difRgb[1], 2) + Math.pow(difRgb[2], 2));
    }


    // Function for calculate the difference between two colors
    diffColor(color, color2) {
        const rDiff = color[0] - color2[0];
        const gDiff = color[1] - color2[1];
        const bDiff = color[2] - color2[2];
        return [rDiff, gDiff, bDiff];
    }


    // Function for convert an array to rgb
    ArrayToRgb(color) {
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    }


    // Function for get the opposite color
    getOppositeColor(color) {
        return [255 - color[0], 255 - color[1], 255 - color[2]];
    }
}


module.exports = { ColorFunctions }