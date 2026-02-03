import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourneyStore } from '@/store/useJourneyStore';
import { Lock, Scan, ShieldCheck } from 'lucide-react';

const AuthScreen = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const [scanning, setScanning] = useState(false);
  const authenticate = useJourneyStore((state) => state.authenticate);

  const correctCode = '1110';

  // Check for bypass in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === '1110') {
      authenticate();
    }
  }, [authenticate]);

  const handleKeyPress = (digit: string) => {
    if (activeIndex >= 4) return;

    const newCode = [...code];
    newCode[activeIndex] = digit;
    setCode(newCode);
    setActiveIndex(activeIndex + 1);
    setError(false);

    // Check code when complete
    if (activeIndex === 3) {
      const enteredCode = newCode.join('');
      if (enteredCode === correctCode) {
        setScanning(true);
        setTimeout(() => {
          authenticate();
        }, 1500);
      } else {
        setError(true);
        setTimeout(() => {
          setCode(['', '', '', '']);
          setActiveIndex(0);
        }, 1000);
      }
    }
  };

  const handleDelete = () => {
    if (activeIndex > 0) {
      const newCode = [...code];
      newCode[activeIndex - 1] = '';
      setCode(newCode);
      setActiveIndex(activeIndex - 1);
      setError(false);
    }
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden noise"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl" />

      {/* Scanner Effect */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-50"
            style={{ boxShadow: '0 0 30px hsl(180 100% 50%), 0 0 60px hsl(180 100% 50% / 0.5)' }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className={`relative z-10 ${error ? 'glitch' : ''}`}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className={`p-6 rounded-full glass-card ${scanning ? 'border-glow-cyan' : 'border-glow-purple'} transition-all duration-500`}>
            {scanning ? (
              <ShieldCheck className="w-12 h-12 text-accent" />
            ) : (
              <Lock className="w-12 h-12 text-primary" />
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {scanning ? 'ACESSO CONCEDIDO' : 'ÁREA RESTRITA'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {scanning ? 'Bem-vinda, Bia...' : 'Digite a data especial: DD/MM'}
          </p>
        </motion.div>

        {/* Code Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-3 mb-8"
        >
          {code.map((digit, idx) => (
            <motion.div
              key={idx}
              animate={error && digit ? { 
                backgroundColor: ['hsl(var(--destructive))', 'transparent'],
                borderColor: ['hsl(var(--destructive))', 'hsl(var(--border))']
              } : {}}
              className={`w-14 h-16 glass-card flex items-center justify-center text-2xl font-bold transition-all duration-300
                ${idx === activeIndex && !scanning ? 'border-primary border-glow-purple' : ''}
                ${digit && !error ? 'text-primary text-glow-purple' : ''}
                ${error && digit ? 'text-destructive border-destructive' : ''}
                ${scanning ? 'border-accent border-glow-cyan' : ''}
              `}
            >
              {digit ? '●' : ''}
            </motion.div>
          ))}
        </motion.div>

        {/* Separator */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
          <Scan className="w-4 h-4 text-muted-foreground" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Keypad */}
        {!scanning && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto"
          >
            {digits.map((digit, idx) => (
              <motion.button
                key={idx}
                whileHover={digit ? { scale: 1.05 } : {}}
                whileTap={digit ? { scale: 0.95 } : {}}
                onClick={() => digit === '⌫' ? handleDelete() : digit && handleKeyPress(digit)}
                disabled={!digit || scanning}
                className={`h-14 rounded-xl font-semibold text-xl transition-all duration-200
                  ${digit ? 'glass-card hover:bg-primary/10 active:bg-primary/20' : ''}
                  ${digit === '⌫' ? 'text-muted-foreground' : 'text-foreground'}
                `}
              >
                {digit}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-destructive text-center mt-6 text-sm font-medium"
            >
              CÓDIGO INCORRETO - Tente novamente
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 text-xs text-muted-foreground"
      >
        Dica: Nosso dia especial 💜
      </motion.p>
    </motion.div>
  );
};

export default AuthScreen;
