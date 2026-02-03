import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flame, Gift } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import confetti from 'canvas-confetti';

const DailyCheckIn = () => {
  const { lastCheckIn, checkInStreak, performCheckIn } = useDashboardStore();
  const { play } = useSoundEffects();
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedIn = lastCheckIn === today;

  const handleCheckIn = () => {
    if (hasCheckedIn) return;
    
    play('click');
    
    const { success, reward } = performCheckIn();
    
    if (success) {
      setRewardAmount(reward);
      setShowReward(true);
      
      // Play appropriate sound
      if (checkInStreak + 1 >= 7) {
        play('levelup');
      } else {
        play('checkin');
      }
      
      // Confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#06b6d4'],
      });
      
      setTimeout(() => setShowReward(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 rounded-2xl relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Check-in Diário</h3>
          </div>
          {checkInStreak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/20">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-xs font-bold text-destructive">{checkInStreak} dias</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {hasCheckedIn 
            ? 'Você já fez check-in hoje! Volte amanhã 💜' 
            : 'Clique para ganhar suas moedas diárias!'
          }
        </p>

        <motion.button
          whileHover={!hasCheckedIn ? { scale: 1.02 } : {}}
          whileTap={!hasCheckedIn ? { scale: 0.98 } : {}}
          onClick={handleCheckIn}
          disabled={hasCheckedIn}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
            ${hasCheckedIn 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-gradient-neon text-white hover:shadow-lg hover:shadow-primary/30'
            }
          `}
        >
          {hasCheckedIn ? (
            <>
              <span>✓</span>
              <span>Check-in Feito</span>
            </>
          ) : (
            <>
              <Gift className="w-5 h-5" />
              <span>Fazer Check-in</span>
            </>
          )}
        </motion.button>

        {/* Streak info */}
        <div className="mt-4 flex gap-1 justify-center">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300
                ${idx < checkInStreak 
                  ? 'bg-gradient-neon text-white' 
                  : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          7 dias seguidos = bônus de 40 moedas!
        </p>
      </div>

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-5xl mb-2"
              >
                💰
              </motion.div>
              <p className="text-2xl font-bold text-primary">+{rewardAmount}</p>
              <p className="text-sm text-muted-foreground">BiaCoins!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyCheckIn;
