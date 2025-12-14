// matrix.js - Matrix Rain Effect
(function() {
    'use strict';
    
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Matrix characters
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charArray = chars.split("");
    
    // Rain drops
    const fontSize = 14;
    let columns;
    let drops = [];
    
    // Initialize matrix
    function initMatrix() {
        resizeCanvas();
        columns = Math.floor(canvas.width / fontSize);
        
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }
    
    // Draw matrix
    function drawMatrix() {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = "rgba(5, 5, 5, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text style
        ctx.fillStyle = "#00ff88";
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Gradient effect - brighter at the head
            const brightness = Math.random() * 0.5 + 0.5;
            ctx.fillStyle = `rgba(0, 255, 136, ${brightness})`;
            
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Move drop down
            drops[i]++;
            
            // Randomly reset drop
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }
    
    // Animation loop
    let animationId;
    function animate() {
        drawMatrix();
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize and start
    window.addEventListener('load', () => {
        initMatrix();
        animate();
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        initMatrix();
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
    
    // Export functions
    window.matrix = {
        init: initMatrix,
        start: animate,
        stop: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }
    };
})();
