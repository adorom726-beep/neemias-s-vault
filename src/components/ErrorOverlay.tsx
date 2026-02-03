import { motion } from 'framer-motion';
import { XCircle, AlertTriangle } from 'lucide-react';

interface ErrorOverlayProps {
  onRetry: () => void;
}

const ErrorOverlay = ({ onRetry }: ErrorOverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'hsla(0, 100%, 10%, 0.95)' }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
      
      {/* Glitch Effect Background */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 0.2, repeat: 3 }}
        className="absolute inset-0 bg-destructive/20"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center glitch"
      >
        {/* Error Icon */}
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 border-2 border-destructive 
            flex items-center justify-center"
          style={{ boxShadow: '0 0 30px hsl(0 100% 50% / 0.5), 0 0 60px hsl(0 100% 50% / 0.3)' }}
        >
          <XCircle className="w-10 h-10 text-destructive" />
        </motion.div>

        {/* Error Title */}
        <motion.div
          animate={{ x: [-2, 2, -2, 0] }}
          transition={{ duration: 0.2, repeat: 2 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-bold text-destructive tracking-wider">ERRO CRÍTICO</h2>
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </motion.div>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground mb-8 font-mono"
        >
          Resposta incorreta - Tente de novo, Bia
        </motion.p>

        {/* Retry Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-8 py-3 rounded-xl border-2 border-destructive text-destructive font-semibold
            hover:bg-destructive/10 transition-all duration-300"
        >
          Tentar Novamente
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ErrorOverlay;
