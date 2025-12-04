import React, { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);
  const username = 'AresIntrepid'; // Change this to your username

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 400; // Banner height

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-={}[]|:;<>?/~`';
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px Courier New';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        const gradient = ctx.createLinearGradient(0, drops[i] * fontSize, 0, (drops[i] - 20) * fontSize);
        gradient.addColorStop(0, '#00ff41');
        gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="matrix-banner">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=VT323&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        .matrix-banner {
          background: #000;
          height: 400px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .matrix-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.4;
        }
        
        .banner-content {
          position: relative;
          z-index: 10;
          text-align: center;
        }
        
        .username-display {
          font-family: 'Orbitron', monospace;
          font-size: 120px;
          font-weight: 900;
          color: #00ff41;
          text-shadow: 
            0 0 10px rgba(0, 255, 65, 0.6),
            0 0 20px rgba(0, 255, 65, 0.4),
            0 0 30px rgba(0, 255, 65, 0.3),
            0 0 40px rgba(0, 255, 65, 0.2);
          letter-spacing: 12px;
          animation: subtleGlitch 8s infinite, neonPulse 2s ease-in-out infinite;
          position: relative;
        }
        
        .username-display::before {
          content: attr(data-text);
          position: absolute;
          left: 0;
          text-shadow: -2px 0 #ff00de;
          top: 0;
          color: #00ff41;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          animation: glitch-anim-1 8s infinite;
        }
        
        .username-display::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          text-shadow: 2px 0 #00ffff;
          top: 0;
          color: #00ff41;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          animation: glitch-anim-2 8s infinite;
        }
        
        @keyframes glitch-anim-1 {
          0%, 96%, 100% { 
            clip: rect(0, 0, 0, 0);
            opacity: 0;
          }
          97% { 
            clip: rect(0, 9999px, 200px, 0);
            opacity: 0.8;
            transform: translateX(-3px);
          }
          98% { 
            clip: rect(0, 0, 0, 0);
            opacity: 0;
          }
        }
        
        @keyframes glitch-anim-2 {
          0%, 97%, 100% { 
            clip: rect(0, 0, 0, 0);
            opacity: 0;
          }
          98% { 
            clip: rect(0, 9999px, 200px, 0);
            opacity: 0.8;
            transform: translateX(3px);
          }
          99% { 
            clip: rect(0, 0, 0, 0);
            opacity: 0;
          }
        }
        
        @keyframes neonPulse {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(0, 255, 65, 0.6),
              0 0 20px rgba(0, 255, 65, 0.4),
              0 0 30px rgba(0, 255, 65, 0.3),
              0 0 40px rgba(0, 255, 65, 0.2);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(0, 255, 65, 0.7),
              0 0 30px rgba(0, 255, 65, 0.5),
              0 0 45px rgba(0, 255, 65, 0.3),
              0 0 60px rgba(0, 255, 65, 0.2);
          }
        }
        
        @keyframes subtleGlitch {
          0%, 98%, 100% {
            transform: translate(0, 0);
          }
          99% {
            transform: translate(-2px, 1px);
          }
        }
        
        .subtitle-text {
          font-family: 'VT323', monospace;
          font-size: 28px;
          color: #00ff41;
          opacity: 0.7;
          margin-top: 20px;
          letter-spacing: 4px;
          animation: flicker 3s infinite;
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
          51% { opacity: 1; }
          52% { opacity: 0.4; }
          53% { opacity: 0.8; }
        }
        
        .wake-up {
          position: absolute;
          top: 20px;
          left: 20px;
          font-family: 'VT323', monospace;
          font-size: 20px;
          color: #00ff41;
          opacity: 0.5;
          animation: wakeUpFlicker 4s infinite;
          z-index: 100;
        }
        
        @keyframes wakeUpFlicker {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.2; }
          51% { opacity: 0.9; }
          52% { opacity: 0.3; }
        }
        
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 255, 65, 0) 50%,
            rgba(0, 255, 65, 0.05) 51%
          );
          background-size: 100% 4px;
          animation: scanlineMove 8s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        
        @keyframes scanlineMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(400px); }
        }
        
        .corner-brackets {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid #00ff41;
          opacity: 0.6;
        }
        
        .bracket-tl {
          top: 20px;
          left: 20px;
          border-right: none;
          border-bottom: none;
          animation: bracketPulse 2s ease-in-out infinite;
        }
        
        .bracket-tr {
          top: 20px;
          right: 20px;
          border-left: none;
          border-bottom: none;
          animation: bracketPulse 2s ease-in-out infinite 0.5s;
        }
        
        .bracket-bl {
          bottom: 20px;
          left: 20px;
          border-right: none;
          border-top: none;
          animation: bracketPulse 2s ease-in-out infinite 1s;
        }
        
        .bracket-br {
          bottom: 20px;
          right: 20px;
          border-left: none;
          border-top: none;
          animation: bracketPulse 2s ease-in-out infinite 1.5s;
        }
        
        @keyframes bracketPulse {
          0%, 100% {
            opacity: 0.6;
            box-shadow: 0 0 5px #00ff41;
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 20px #00ff41;
          }
        }
        
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.5;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .username-display {
            font-size: 60px;
            letter-spacing: 6px;
          }
          
          .subtitle-text {
            font-size: 20px;
          }
          
          .wake-up {
            font-size: 16px;
          }
        }
      `}</style>
      
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="grid-overlay" />
      <div className="scanline" />
      
      <div className="wake-up">Wake up, Neo...</div>
      
      <div className="corner-brackets bracket-tl" />
      <div className="corner-brackets bracket-tr" />
      <div className="corner-brackets bracket-bl" />
      <div className="corner-brackets bracket-br" />
      
      <div className="banner-content">
        <div className="username-display" data-text={username}>
          {username}
        </div>
        <div className="subtitle-text">
          &gt; SYSTEM ACCESS GRANTED_
        </div>
      </div>
    </div>
  );
}

export default App;