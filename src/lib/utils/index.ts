/**
 * reference: https://stackoverflow.com/a/5624139
 */
export function hex2rgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * reference: https://stackoverflow.com/a/36888120
 */
export function rgb2lum(r: number, g: number, b: number) {
    return ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;
}

export function textColor(hexcolor: string) {
    const rgb = hex2rgb(hexcolor);
    const lum = rgb === null ? 1 : rgb2lum(rgb.r, rgb.g, rgb.b);

    return lum > 0.5 ? "#000" : "#fff";
}
