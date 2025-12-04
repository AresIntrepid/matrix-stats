export default function handler(req, res) {
  const username = 'AresIntrepid';
  
  // Generate random Matrix characters for the background
  const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
  let matrixChars = '';
  
  // Create 50 columns of falling characters
  for (let col = 0; col < 50; col++) {
    const x = col * 24;
    const numChars = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < numChars; i++) {
      const y = Math.random() * 400;
      const char = matrix[Math.floor(Math.random() * matrix.length)];
      const opacity = Math.random() * 0.5 + 0.2;
      
      matrixChars += `<text x="${x}" y="${y}" fill="#00ff41" opacity="${opacity}" font-family="Courier New" font-size="14">${char}</text>`;
    }
  }

  const svg = `
    <svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&amp;family=VT323&amp;display=swap');
          
          .username {
            font-family: 'Orbitron', monospace;
            font-size: 100px;
            font-weight: 900;
            fill: #00ff41;
            filter: drop-shadow(0 0 10px rgba(0, 255, 65, 0.6)) 
                    drop-shadow(0 0 20px rgba(0, 255, 65, 0.4))
                    drop-shadow(0 0 30px rgba(0, 255, 65, 0.3));
          }
          
          .subtitle {
            font-family: 'VT323', monospace;
            font-size: 24px;
            fill: #00ff41;
            opacity: 0.7;
          }
          
          .wake-up {
            font-family: 'VT323', monospace;
            font-size: 18px;
            fill: #00ff41;
            opacity: 0.5;
          }
          
          .scanline {
            fill: none;
            stroke: rgba(0, 255, 65, 0.1);
            stroke-width: 1;
          }
          
          .bracket {
            fill: none;
            stroke: #00ff41;
            stroke-width: 2;
            opacity: 0.6;
          }
          
          .grid-line {
            stroke: rgba(0, 255, 65, 0.05);
            stroke-width: 1;
          }
        </style>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="400" fill="#000000"/>
      
      <!-- Grid overlay -->
      ${Array.from({ length: 24 }, (_, i) => 
        `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="400" class="grid-line"/>`
      ).join('')}
      ${Array.from({ length: 8 }, (_, i) => 
        `<line x1="0" y1="${i * 50}" x2="1200" y2="${i * 50}" class="grid-line"/>`
      ).join('')}
      
      <!-- Matrix characters background -->
      <g opacity="0.3">
        ${matrixChars}
      </g>
      
      <!-- Scanlines -->
      ${Array.from({ length: 100 }, (_, i) => 
        `<line x1="0" y1="${i * 4}" x2="1200" y2="${i * 4}" class="scanline"/>`
      ).join('')}
      
      <!-- Corner brackets -->
      <!-- Top left -->
      <path d="M 20 20 L 20 60 M 20 20 L 60 20" class="bracket"/>
      <!-- Top right -->
      <path d="M 1180 20 L 1180 60 M 1180 20 L 1140 20" class="bracket"/>
      <!-- Bottom left -->
      <path d="M 20 380 L 20 340 M 20 380 L 60 380" class="bracket"/>
      <!-- Bottom right -->
      <path d="M 1180 380 L 1180 340 M 1180 380 L 1140 380" class="bracket"/>
      
      <!-- Wake up Neo text -->
      <text x="30" y="40" class="wake-up">Wake up, Neo...</text>
      
      <!-- Main content -->
      <g>
        <!-- Username -->
        <text x="600" y="220" text-anchor="middle" class="username" filter="url(#glow)">
          ${username}
        </text>
        
        <!-- Subtitle -->
        <text x="600" y="260" text-anchor="middle" class="subtitle">
          &gt; SYSTEM ACCESS GRANTED_
        </text>
      </g>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(svg);
}