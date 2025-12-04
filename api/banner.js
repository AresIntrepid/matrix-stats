const Jimp = require('jimp').default || require('jimp');
const { GifFrame, GifCodec } = require('gifwrap');

export default async function handler(req, res) {
  try {
    const username = 'AresIntrepid';
    const width = 1200;
    const height = 400;
    const frames = 20;
    
    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^*()';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -30);
    }
    
    const gifFrames = [];
    
    for (let frame = 0; frame < frames; frame++) {
      const image = await new Jimp(width, height, 0x000000ff);
      
      // Draw grid lines
      for (let i = 0; i < 24; i++) {
        const x = i * 50;
        for (let y = 0; y < height; y += 2) {
          image.setPixelColor(0x00ff410d, x, y);
        }
      }
      
      // Draw falling matrix characters (as simple dots)
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        if (y > 0 && y < height - 10) {
          for (let py = 0; py < 10; py++) {
            for (let px = 0; px < 8; px++) {
              if (x + px < width && y + py < height) {
                const opacity = Math.floor(Math.max(50, 255 - (py * 20)));
                const color = (0x00ff4100 | opacity);
                image.setPixelColor(color, x + px, y + py);
              }
            }
          }
        }
        
        if (y > height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      // Draw corner brackets
      for (let i = 0; i < 40; i++) {
        image.setPixelColor(0x00ff4199, 20, 20 + i);
        image.setPixelColor(0x00ff4199, 20 + i, 20);
        image.setPixelColor(0x00ff4199, 1180, 20 + i);
        image.setPixelColor(0x00ff4199, 1180 - i, 20);
        image.setPixelColor(0x00ff4199, 20, 380 - i);
        image.setPixelColor(0x00ff4199, 20 + i, 380);
        image.setPixelColor(0x00ff4199, 1180, 380 - i);
        image.setPixelColor(0x00ff4199, 1180 - i, 380);
      }
      
      // Add text
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
      const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
      
      image.print(smallFont, 30, 25, 'Wake up, Neo...');
      image.print(font, 0, 150, {
        text: username,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width);
      image.print(smallFont, 0, 240, {
        text: 'SYSTEM ACCESS GRANTED',
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width);
      
      // Make text green
      image.color([
        { apply: 'red', params: [-255] },
        { apply: 'green', params: [0] },
        { apply: 'blue', params: [-190] }
      ]);
      
      const gifFrame = new GifFrame(image.bitmap);
      gifFrames.push(gifFrame);
    }
    
    const codec = new GifCodec();
    const gif = await codec.encodeGif(gifFrames, { loops: 0 });
    
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(gif.buffer);
    
  } catch (error) {
    console.error('Error generating GIF:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}