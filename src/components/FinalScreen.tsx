import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Plane, Car, Star, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface FinalScreenProps {
  onContinue?: () => void;
}

const FinalScreen = ({ onContinue }: FinalScreenProps) => {
  const [showTicket, setShowTicket] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const { play } = useSoundEffects();

  useEffect(() => {
    // Play success sound
    play('success');
    
    // Epic confetti celebration
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#9D4EDD', '#F72585', '#00F5FF', '#FFD700'];

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
        colors: colors,
        shapes: ['star', 'circle'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    })();

    // Show ticket after delay
    setTimeout(() => setShowTicket(true), 2000);
    // Show continue button after ticket
    setTimeout(() => setShowContinue(true), 4000);
  }, [play]);

  const handleContinue = () => {
    play('click');
    onContinue?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/20 via-neon-pink/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-neon-pink/10 rounded-full blur-3xl" />

      {/* Floating Hearts */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100vh', x: Math.random() * 100 - 50, opacity: 0 }}
          animate={{ 
            y: '-100vh', 
            opacity: [0, 1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'linear'
          }}
          className="absolute"
          style={{ left: `${Math.random() * 100}%` }}
        >
          <Heart className="w-4 h-4 text-neon-pink/50" fill="currentColor" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Crown Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="p-5 rounded-full glass-card border-glow-pink animate-float">
            <Crown className="w-10 h-10 text-secondary" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary tracking-widest">ACESSO LIBERADO</span>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Plano do Neemias Confirmado
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground text-lg mb-8 leading-relaxed"
        >
          O objetivo é real: Viagem para os EUA, um carro foda pra gente passear e o nosso destino final...
        </motion.p>

        {/* Goals Preview */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center gap-6 mb-8"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center mb-2 mx-auto border-glow-purple">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">EUA</span>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center mb-2 mx-auto border-glow-pink">
              <Car className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Carro</span>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center mb-2 mx-auto border-glow-cyan">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">Destino</span>
          </div>
        </motion.div>

        {/* VIP Ticket */}
        {showTicket && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: 90 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="relative"
          >
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-neon blur-xl opacity-50 rounded-2xl" />
            
            {/* Ticket Card */}
            <div className="relative glass-card p-6 rounded-2xl border-2 border-secondary/50 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-transparent rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-full" />
              
              {/* Ticket Holes */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-background rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-background rounded-full" />

              {/* VIP Badge */}
              <div className="flex justify-center mb-4">
                <span className="px-4 py-1 rounded-full bg-gradient-neon text-xs font-bold tracking-widest">
                  TICKET VIP
                </span>
              </div>

              {/* Main Title */}
              <h2 className="text-2xl font-bold text-foreground mb-2">
                PARTIDA PARA O
              </h2>
              <h3 className="text-3xl font-bold gradient-text text-glow-pink mb-4">
                MOTEL GAMER 🎮
              </h3>

              {/* Dashed Line */}
              <div className="border-t-2 border-dashed border-border/50 my-4" />

              {/* Details */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="text-left">
                  <p className="text-xs opacity-50 mb-1">PASSAGEIROS</p>
                  <p className="font-medium text-foreground">Neemias & Bia</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-50 mb-1">STATUS</p>
                  <p className="font-medium text-success">Confirmado ✓</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue to Dashboard Button */}
        {showContinue && onContinue && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="mt-8 w-full py-4 rounded-2xl bg-gradient-neon text-white font-semibold 
              flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            <span>Acessar seu Painel VIP</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Love Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-8 flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Heart className="w-4 h-4 text-secondary" fill="currentColor" />
          <span className="text-sm">Te amo, Bia</span>
          <Heart className="w-4 h-4 text-secondary" fill="currentColor" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalScreen;
