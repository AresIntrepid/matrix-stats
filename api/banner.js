const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');

export default async function handler(req, res) {
  try {
    const username = 'AresIntrepid';
    const width = 1200;
    const height = 400;
    const frames = 25;
    
    const encoder = new GIFEncoder(width, height);
    
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
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
      drops[i] = Math.floor(Math.random() * -30);
    }
    
    for (let frame = 0; frame < frames; frame++) {
      // Create SVG for each frame
      let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#000000"/>`;
      
      // Grid lines
      for (let i = 0; i < 24; i++) {
        svg += `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${height}" stroke="rgba(0,255,65,0.05)" stroke-width="1"/>`;
      }
      for (let i = 0; i < 8; i++) {
        svg += `<line x1="0" y1="${i * 50}" x2="${width}" y2="${i * 50}" stroke="rgba(0,255,65,0.05)" stroke-width="1"/>`;
      }
      
      // Matrix characters
      for (let i = 0; i < drops.length; i++) {
        const char = matrix[Math.floor(Math.random() * matrix.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        if (y > 0 && y < height) {
          const opacity = Math.max(0.2, 1 - (Math.abs(drops[i]) * 0.02));
          svg += `<text x="${x}" y="${y}" fill="#00ff41" opacity="${opacity}" font-family="Courier New" font-size="14">${char}</text>`;
        }
        
        if (y > height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      // Corner brackets
      svg += `<path d="M 20 20 L 20 60 M 20 20 L 60 20" stroke="#00ff41" stroke-width="2" fill="none" opacity="0.6"/>`;
      svg += `<path d="M 1180 20 L 1180 60 M 1180 20 L 1140 20" stroke="#00ff41" stroke-width="2" fill="none" opacity="0.6"/>`;
      svg += `<path d="M 20 380 L 20 340 M 20 380 L 60 380" stroke="#00ff41" stroke-width="2" fill="none" opacity="0.6"/>`;
      svg += `<path d="M 1180 380 L 1180 340 M 1180 380 L 1140 380" stroke="#00ff41" stroke-width="2" fill="none" opacity="0.6"/>`;
      
      // Text
      svg += `<text x="30" y="40" fill="#00ff41" opacity="0.5" font-family="Courier New" font-size="18">Wake up, Neo...</text>`;
      svg += `<text x="600" y="220" text-anchor="middle" fill="#00ff41" font-family="Courier New" font-size="100" font-weight="900" style="filter: drop-shadow(0 0 10px rgba(0,255,65,0.8));">${username}</text>`;
      svg += `<text x="600" y="260" text-anchor="middle" fill="#00ff41" opacity="0.7" font-family="Courier New" font-size="24">SYSTEM ACCESS GRANTED</text>`;
      
      svg += '</svg>';
      
      // Convert SVG to RGBA buffer with proper dimensions
      const { data, info } = await sharp(Buffer.from(svg))
        .resize(width, height)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      encoder.addFrame(data);
    }
    
    encoder.finish();
    
  } catch (error) {
    console.error('Error generating GIF:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}