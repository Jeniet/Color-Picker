document.getElementById('colorPicker').addEventListener('input', updateColors);
document.getElementById('opacityRange').addEventListener('input', updateOpacity);

let currentColor = '#ffffff';
let currentOpacity = 1;

function updateColors(event) {
    currentColor = event.target.value;
    document.getElementById('shadeSection').classList.remove('hidden');
    document.getElementById('harmonySection').classList.remove('hidden');
    updateDisplay();
}

function updateOpacity(event) {
    currentOpacity = event.target.value;
    updateDisplay();
}

function updateDisplay() {
    const colorBox = document.getElementById('colorBox');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const rgbaValue = document.getElementById('rgbaValue');
    
    const rgb = hexToRgb(currentColor);
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
    const hexAlpha = rgbaToHexA(rgb.r, rgb.g, rgb.b, currentOpacity);

    colorBox.style.backgroundColor = rgba;
    hexValue.textContent = currentColor;
    rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    rgbaValue.textContent = rgba;

    generateShades(currentColor);
    generateHarmonies(currentColor);
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbaToHexA(r, g, b, a) {
    const alpha = Math.round(a * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b + (alpha << 24)).toString(16).slice(1).toUpperCase()}`;
}

function generateShades(hex) {
    const rgb = hexToRgb(hex);
    const shadeContainer = document.getElementById('shadeContainer');
    shadeContainer.innerHTML = '';

    for (let i = -7; i <= 6; i++) {
        const shade = lightenDarkenColor(rgb, i * 10);
        const shadeDiv = document.createElement('div');
        shadeDiv.className = 'shade';
        shadeDiv.style.backgroundColor = rgbToHex(shade.r, shade.g, shade.b);
        shadeDiv.setAttribute('onclick', `copyToClipboard('${rgbToHex(shade.r, shade.g, shade.b)}')`);
        shadeContainer.appendChild(shadeDiv);
    }
}

function lightenDarkenColor({r, g, b}, amt) {
    const newR = Math.max(0, Math.min(255, r + amt));
    const newG = Math.max(0, Math.min(255, g + amt));
    const newB = Math.max(0, Math.min(255, b + amt));
    return { r: newR, g: newG, b: newB };
}

function generateHarmonies(hex) {
    const harmonyContainer = document.getElementById('harmonyContainer');
    harmonyContainer.innerHTML = '';

    const harmonies = getHarmonies(hex);

    harmonies.forEach(color => {
        const harmonyDiv = document.createElement('div');
        harmonyDiv.className = 'harmony';
        harmonyDiv.style.backgroundColor = color;
        harmonyDiv.setAttribute('onclick', `copyToClipboard('${color}')`);
        harmonyContainer.appendChild(harmonyDiv);
    });
}

function getHarmonies(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const harmonies = [
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),  
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l), 
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), 
        hslToHex((hsl.h - 120 + 360) % 360, hsl.s, hsl.l), 
        hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),  
        hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)  
    ];

    return harmonies;
}

function rgbToHsl(r, g, b) {
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

    return { h: h * 360, s: s, l: l };
}

function hslToHex(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; 
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 3) return q;
            if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

function copyToClipboard(value) {
    const message = document.getElementById('message');
    navigator.clipboard.writeText(value).then(() => {
        message.textContent = `${value} copied!`;
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    });
}

updateDisplay();
