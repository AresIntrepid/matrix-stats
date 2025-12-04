const Jimp = require('jimp');
const GifEncoder = require('gif-encoder-2');

export default async function handler(req, res) {
  const username = 'AresIntrepid';
  const width = 1200;
  const height = 400;
  const frames = 30;
  
  const encoder = new GifEncoder(width, height);
  
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  encoder.createReadStream().pipe(res);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);
  
  const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^*()';
  const fontSize = 14;
  const columns = Math.floor(width / fontSize);
  const drops = [];
  
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * -50);
  }
  
  const greenColor = Jimp.rgbaToInt(0, 255, 65, 255);
  const blackColor = Jimp.rgbaToInt(0, 0, 0, 255);
  const gridColor = Jimp.rgbaToInt(0, 255, 65, 13);
  const bracketColor = Jimp.rgbaToInt(0, 255, 65, 153);
  
  for (let frame = 0; frame < frames; frame++) {
    const image = new Jimp(width, height, blackColor);
    
    // Draw grid
    for (let i = 0; i < 24; i++) {
      const x = i * 50;
      for (let y = 0; y < height; y++) {
        image.setPixelColor(gridColor, x, y);
      }
    }
    for (let i = 0; i < 8; i++) {
      const y = i * 50;
      for (let x = 0; x < width; x++) {
        image.setPixelColor(gridColor, x, y);
      }
    }
    
    // Draw falling matrix characters
    for (let i = 0; i < drops.length; i++) {
      const char = matrix[Math.floor(Math.random() * matrix.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      
      if (y > 0 && y < height) {
        // Draw character (simplified as rectangles since we don't have font rendering)
        for (let py = 0; py < 12; py++) {
          for (let px = 0; px < 8; px++) {
            if (x + px < width && y + py < height) {
              const opacity = Math.max(0, 255 - (Math.abs(drops[i]) * 5));
              const color = Jimp.rgbaToInt(0, 255, 65, opacity);
              image.setPixelColor(color, x + px, y + py);
            }
          }
        }
      }
      
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    // Draw corner brackets
    const drawLine = (x1, y1, x2, y2) => {
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const sx = x1 < x2 ? 1 : -1;
      const sy = y1 < y2 ? 1 : -1;
      let err = dx - dy;
      
      while (true) {
        if (x1 >= 0 && x1 < width && y1 >= 0 && y1 < height) {
          image.setPixelColor(bracketColor, x1, y1);
        }
        if (x1 === x2 && y1 === y2) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
      }
    };
    
    // Top left
    drawLine(20, 20, 20, 60);
    drawLine(20, 20, 60, 20);
    // Top right
    drawLine(1180, 20, 1180, 60);
    drawLine(1180, 20, 1140, 20);
    // Bottom left
    drawLine(20, 380, 20, 340);
    drawLine(20, 380, 60, 380);
    // Bottom right
    drawLine(1180, 380, 1180, 340);
    drawLine(1180, 380, 1140, 380);
    
    // Load font and add text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    
    // Tint the fonts to green
    image.print(smallFont, 30, 25, 'Wake up, Neo...');
    image.print(font, 0, 160, {
      text: username,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, width, height);
    image.print(smallFont, 0, 240, {
      text: 'SYSTEM ACCESS GRANTED',
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
    }, width);
    
    // Apply green color to text (color replacement)
    image.scan(0, 0, width, height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];
      
      // If it's white text, make it green
      if (red > 200 && green > 200 && blue > 200 && alpha > 200) {
        this.bitmap.data[idx + 0] = 0;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 65;
      }
    });
    
    encoder.addFrame(image.bitmap.data);
  }
  
  encoder.finish();
}