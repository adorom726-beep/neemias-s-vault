import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';

const CoinBalance = () => {
  const biaCoins = useDashboardStore((state) => state.biaCoins);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-2xl border-glow-purple"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
            className="w-12 h-12 rounded-xl bg-gradient-neon flex items-center justify-center"
          >
            <span className="text-2xl">💎</span>
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Seu Saldo</p>
            <motion.p
              key={biaCoins}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-foreground"
            >
              {biaCoins} <span className="text-primary text-sm">BiaCoins</span>
            </motion.p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-primary animate-pulse-neon" />
      </div>
    </motion.div>
  );
};

export default CoinBalance;
