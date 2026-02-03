import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, Target, RotateCcw } from 'lucide-react';
import CoinBalance from './dashboard/CoinBalance';
import DailyCheckIn from './dashboard/DailyCheckIn';
import DailyMission from './dashboard/DailyMission';
import RewardsShop from './dashboard/RewardsShop';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';

type Tab = 'home' | 'shop' | 'missions';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const resetJourney = useJourneyStore((state) => state.resetJourney);
  const { play } = useSoundEffects();
  const biaCoins = useDashboardStore((state) => state.biaCoins);

  const handleTabChange = (tab: Tab) => {
    play('click');
    setActiveTab(tab);
  };

  const tabs = [
    { id: 'home' as Tab, icon: Home, label: 'Início' },
    { id: 'shop' as Tab, icon: ShoppingBag, label: 'Loja' },
    { id: 'missions' as Tab, icon: Target, label: 'Missões' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex flex-col noise"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-radial from-neon-purple/5 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-1/4 left-0 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-80 h-80 bg-neon-pink/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Olá, Bia! 💜</h1>
            <p className="text-xs text-muted-foreground">Seu painel exclusivo</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetJourney}
            className="p-2 rounded-lg glass-card text-muted-foreground hover:text-foreground transition-colors"
            title="Refazer Quiz"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 relative z-10">
        {/* Coin Balance - Always visible */}
        <CoinBalance />

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <DailyCheckIn />
                <DailyMission />
                
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-4 rounded-2xl"
                >
                  <h3 className="font-semibold text-foreground mb-3 text-sm">Dica do Dia</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete missões e faça check-in diário para ganhar mais BiaCoins! 
                    Acumule e troque por recompensas especiais 💜
                  </p>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RewardsShop />
              </motion.div>
            )}

            {activeTab === 'missions' && (
              <motion.div
                key="missions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <DailyMission />
                
                {/* Future missions teaser */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-5 rounded-2xl border-dashed border-2 border-border/50"
                >
                  <div className="text-center">
                    <span className="text-4xl mb-3 block">🔮</span>
                    <h4 className="font-semibold text-foreground mb-1">Mais Missões em Breve!</h4>
                    <p className="text-sm text-muted-foreground">
                      O Neemias está preparando desafios especiais pra você...
                    </p>
                  </div>
                </motion.div>

                {/* Completed missions counter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-4 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de Moedas</span>
                    <span className="text-lg font-bold text-primary">{biaCoins} 💎</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/30 z-20">
        <div className="flex justify-around py-2 px-4 max-w-md mx-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>
    </motion.div>
  );
};

export default Dashboard;
