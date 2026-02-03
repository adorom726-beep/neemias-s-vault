import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, Lock } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import confetti from 'canvas-confetti';

const RewardsShop = () => {
  const { biaCoins, shopItems, purchaseItem } = useDashboardStore();
  const { play } = useSoundEffects();
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const handlePurchase = (itemId: string, price: number) => {
    if (biaCoins < price) {
      play('error');
      return;
    }

    play('click');
    
    const success = purchaseItem(itemId);
    if (success) {
      setPurchasedId(itemId);
      play('purchase');
      
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899'],
      });
      
      setTimeout(() => setPurchasedId(null), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Loja de Recompensas</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Troque suas BiaCoins por recompensas especiais do Neemias! 💜
      </p>

      <div className="grid gap-3">
        {shopItems.map((item, index) => {
          const canAfford = biaCoins >= item.price;
          const isPurchased = item.purchased;
          const justPurchased = purchasedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 rounded-xl relative overflow-hidden transition-all duration-300 ${
                isPurchased 
                  ? 'border-success/30 bg-success/5' 
                  : canAfford 
                    ? 'hover:border-primary/50' 
                    : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={justPurchased ? { scale: [1, 1.3, 1] } : {}}
                  className="text-3xl"
                >
                  {item.icon}
                </motion.div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-sm font-bold ${canAfford ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.price} 💎
                  </span>
                  
                  <motion.button
                    whileHover={!isPurchased && canAfford ? { scale: 1.05 } : {}}
                    whileTap={!isPurchased && canAfford ? { scale: 0.95 } : {}}
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={isPurchased || !canAfford}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1
                      ${isPurchased 
                        ? 'bg-success/20 text-success cursor-default' 
                        : canAfford 
                          ? 'bg-gradient-neon text-white hover:shadow-md hover:shadow-primary/30' 
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }
                    `}
                  >
                    {isPurchased ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Comprado</span>
                      </>
                    ) : canAfford ? (
                      <span>Comprar</span>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Bloqueado</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Purchase animation overlay */}
              <AnimatePresence>
                {justPurchased && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-success/10 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      className="text-4xl"
                    >
                      ✨
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RewardsShop;
