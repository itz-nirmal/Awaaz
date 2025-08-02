"use client";
import React, { useRef, useEffect } from 'react';

const DOTS = 80;
const DOT_RADIUS = 2.5;
const LINE_DISTANCE = 120;
const DOT_COLOR = 'rgba(255, 255, 255, 0.7)';
const LINE_COLOR = 'rgba(180, 120, 255, 0.25)';
const BG_GRADIENT = [
  { stop: 0, color: '#0a001a' }, // almost black purple
  { stop: 0.5, color: '#14002a' }, // even deeper dark purple
  { stop: 0.85, color: '#1a0036' }, // deep dark purple
  { stop: 1, color: '#22003a' }, // very dark, subtle purple for right side
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const DotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const dots = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize dots
    dots.current = Array.from({ length: DOTS }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
    }));

    // Animation loop
    let animationId: number;
    function animate() {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      BG_GRADIENT.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
      ctx.clearRect(0, 0, width, height);
      // Draw glossy gradient background
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Draw dots
      for (const dot of dots.current) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = DOT_COLOR;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw lines between close dots
      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const a = dots.current[i];
          const b = dots.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINE_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 1.2 - dist / LINE_DISTANCE;
            ctx.globalAlpha = 1 - dist / LINE_DISTANCE;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw lines to mouse
      for (const dot of dots.current) {
        const dist = Math.hypot(dot.x - mouse.current.x, dot.y - mouse.current.y);
        if (dist < LINE_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5 - dist / LINE_DISTANCE;
          ctx.globalAlpha = 1 - dist / LINE_DISTANCE;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Move dots
      for (const dot of dots.current) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      }

      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Mouse tracking
    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    function onMouseOut() {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);

    // Handle resize
    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gradient.addColorStop(0, BG_GRADIENT[0].color);
      gradient.addColorStop(0.5, BG_GRADIENT[1].color);
      gradient.addColorStop(1, BG_GRADIENT[2].color);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default DotBackground;
