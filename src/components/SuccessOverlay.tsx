import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Sparkles } from 'lucide-react';

interface SuccessOverlayProps {
  message: string;
  onContinue: () => void;
}

const SuccessOverlay = ({ message, onContinue }: SuccessOverlayProps) => {
  useEffect(() => {
    // Trigger confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#9D4EDD', '#F72585', '#00F5FF'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-sm text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-success flex items-center justify-center shadow-neon-cyan"
          style={{ boxShadow: '0 0 40px hsl(150 100% 50% / 0.5), 0 0 80px hsl(180 100% 50% / 0.3)' }}
        >
          <Check className="w-10 h-10 text-background" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold text-accent text-glow-cyan">CERTO!</h2>
          <Sparkles className="w-5 h-5 text-accent" />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground text-lg mb-8 px-4"
        >
          {message}
        </motion.p>

        {/* Continue Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="px-8 py-3 rounded-xl bg-gradient-neon text-foreground font-semibold
            shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-neon"
        >
          Continuar →
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessOverlay;
