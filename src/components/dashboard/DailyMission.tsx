import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Coins } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import confetti from 'canvas-confetti';

const DailyMission = () => {
  const { currentMission, initializeDailyMission, completeMission } = useDashboardStore();
  const { play } = useSoundEffects();
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    initializeDailyMission();
  }, [initializeDailyMission]);

  const handleComplete = () => {
    if (!currentMission || currentMission.completed) return;
    
    play('mission');
    completeMission();
    setShowComplete(true);
    
    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#22d3ee', '#facc15'],
    });
    
    setTimeout(() => setShowComplete(false), 2500);
  };

  if (!currentMission) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 rounded-2xl relative overflow-hidden"
    >
      {/* Background effect */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-neon-pink/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-pink" />
            <h3 className="font-semibold text-foreground">Missão do Dia</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary">+{currentMission.reward}</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl mb-4 transition-all duration-300 ${
          currentMission.completed 
            ? 'bg-success/10 border border-success/30' 
            : 'bg-muted/50'
        }`}>
          <h4 className="font-semibold text-foreground mb-1">{currentMission.title}</h4>
          <p className="text-sm text-muted-foreground">{currentMission.description}</p>
        </div>

        <motion.button
          whileHover={!currentMission.completed ? { scale: 1.02 } : {}}
          whileTap={!currentMission.completed ? { scale: 0.98 } : {}}
          onClick={handleComplete}
          disabled={currentMission.completed}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
            ${currentMission.completed 
              ? 'bg-success/20 text-success cursor-not-allowed' 
              : 'bg-neon-pink/90 text-white hover:bg-neon-pink hover:shadow-lg hover:shadow-neon-pink/30'
            }
          `}
        >
          {currentMission.completed ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Missão Completa!</span>
            </>
          ) : (
            <>
              <span>Completar Missão</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Completion Animation */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20"
          >
            <div className="text-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-2"
              >
                🎯
              </motion.div>
              <p className="text-xl font-bold text-success">Missão Completa!</p>
              <p className="text-sm text-primary">+{currentMission.reward} BiaCoins</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyMission;
