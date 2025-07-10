import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface HeroVideoAnimationProps {
  onCtaClick?: () => void;
}

export function HeroVideoAnimation({ onCtaClick }: HeroVideoAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation variables
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      type: 'neural' | 'data' | 'connection';
    }> = [];

    // Create particles representing AI neural networks
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `hsl(${207 + Math.random() * 55}, 90%, ${60 + Math.random() * 30}%)`,
        opacity: Math.random() * 0.8 + 0.2,
        type: Math.random() > 0.7 ? 'neural' : Math.random() > 0.5 ? 'data' : 'connection'
      });
    }

    const animate = () => {
      if (!isPlaying) return;

      timeRef.current += 0.02;
      
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position with wave motion
        particle.x += particle.speedX + Math.sin(timeRef.current + index * 0.1) * 0.5;
        particle.y += particle.speedY + Math.cos(timeRef.current + index * 0.1) * 0.5;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulsing opacity
        particle.opacity = 0.3 + Math.sin(timeRef.current * 2 + index * 0.5) * 0.3;

        // Draw particle based on type
        ctx.globalAlpha = particle.opacity;
        
        if (particle.type === 'neural') {
          // Neural node
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Glow effect
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace('90%', '90%').replace(/[\d.]+%\)$/, '20%)');
          ctx.fill();
        } else if (particle.type === 'data') {
          // Data cube
          ctx.fillStyle = particle.color;
          ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
        } else {
          // Connection lines
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x + 20, particle.y + 10);
          ctx.stroke();
        }
      });

      // Draw connections between nearby particles
      ctx.globalAlpha = 0.2;
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - distance / 300})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Central focal point with pulsing effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const pulseRadius = 30 + Math.sin(timeRef.current * 3) * 10;
      
      ctx.globalAlpha = 0.6;
      const centralGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      centralGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      centralGradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)');
      centralGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      
      ctx.fillStyle = centralGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const animate = () => {
        timeRef.current += 0.02;
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Canvas Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-6 max-w-2xl mx-auto px-6">
          <div className="space-y-4">
            <h1 className="text-hierarchy-1 text-white drop-shadow-lg">
              The Future of AI Discovery
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md max-w-lg mx-auto">
              Experience the most comprehensive AI tool directory with intelligent recommendations and real-time insights
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform duration-300"
              onClick={onCtaClick}
            >
              Explore AI Tools
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-20">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{ width: `${((timeRef.current * 10) % 100)}%` }}
        />
      </div>
    </div>
  );
}