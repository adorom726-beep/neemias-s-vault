import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  purchased: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  date: string;
}

interface DashboardState {
  // Coins
  biaCoins: number;
  
  // Daily Check-in
  lastCheckIn: string | null;
  checkInStreak: number;
  
  // Shop
  shopItems: ShopItem[];
  
  // Daily Mission
  currentMission: DailyMission | null;
  
  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  performCheckIn: () => { success: boolean; reward: number };
  purchaseItem: (itemId: string) => boolean;
  completeMission: () => void;
  initializeDailyMission: () => void;
}

const SHOP_ITEMS: Omit<ShopItem, 'purchased'>[] = [
  {
    id: 'massage',
    name: 'Massagem Especial',
    description: '15 minutos de massagem do Neemias',
    price: 50,
    icon: '💆‍♀️',
  },
  {
    id: 'movie',
    name: 'Escolha do Filme',
    description: 'Você escolhe o filme da próxima sessão',
    price: 30,
    icon: '🎬',
  },
  {
    id: 'snack',
    name: 'Lanchinho Surpresa',
    description: 'Um lanche do seu gosto',
    price: 40,
    icon: '🍕',
  },
  {
    id: 'date',
    name: 'Date Especial',
    description: 'Um rolê onde você quiser',
    price: 100,
    icon: '💜',
  },
  {
    id: 'photo',
    name: 'Sessão de Fotos',
    description: 'Fotos lindas pra postar',
    price: 25,
    icon: '📸',
  },
  {
    id: 'letter',
    name: 'Carta Escrita à Mão',
    description: 'Uma cartinha romântica do Neemias',
    price: 60,
    icon: '💌',
  },
];

const DAILY_MISSIONS = [
  {
    id: 'selfie',
    title: 'Selfie do Dia',
    description: 'Manda uma selfie linda pro Neemias',
    reward: 15,
  },
  {
    id: 'love',
    title: 'Declaração',
    description: 'Diz "eu te amo" de um jeito criativo',
    reward: 20,
  },
  {
    id: 'memory',
    title: 'Memória Especial',
    description: 'Conta uma memória boa nossa',
    reward: 25,
  },
  {
    id: 'music',
    title: 'Música do Dia',
    description: 'Manda uma música que te lembra de nós',
    reward: 15,
  },
  {
    id: 'compliment',
    title: 'Elogio Sincero',
    description: 'Me faz um elogio que vem do coração',
    reward: 20,
  },
  {
    id: 'future',
    title: 'Plano Futuro',
    description: 'Fala algo que quer fazer comigo',
    reward: 30,
  },
  {
    id: 'surprise',
    title: 'Surpresa',
    description: 'Me surpreende com algo inesperado',
    reward: 35,
  },
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getDailyMission = (date: string): DailyMission => {
  // Use date to deterministically pick a mission
  const dayOfYear = Math.floor(
    (new Date(date).getTime() - new Date(date.slice(0, 4) + '-01-01').getTime()) / 86400000
  );
  const missionIndex = dayOfYear % DAILY_MISSIONS.length;
  const mission = DAILY_MISSIONS[missionIndex];
  
  return {
    ...mission,
    completed: false,
    date,
  };
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      biaCoins: 50, // Starting bonus
      lastCheckIn: null,
      checkInStreak: 0,
      shopItems: SHOP_ITEMS.map(item => ({ ...item, purchased: false })),
      currentMission: null,

      addCoins: (amount: number) => {
        set((state) => ({ biaCoins: state.biaCoins + amount }));
      },

      spendCoins: (amount: number) => {
        const { biaCoins } = get();
        if (biaCoins >= amount) {
          set({ biaCoins: biaCoins - amount });
          return true;
        }
        return false;
      },

      performCheckIn: () => {
        const { lastCheckIn, checkInStreak, addCoins } = get();
        const today = getTodayDate();
        
        if (lastCheckIn === today) {
          return { success: false, reward: 0 };
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = 1;
        if (lastCheckIn === yesterdayStr) {
          newStreak = checkInStreak + 1;
        }
        
        // Reward increases with streak (base 10 + streak bonus)
        const reward = 10 + Math.min(newStreak - 1, 6) * 5;
        
        addCoins(reward);
        set({ lastCheckIn: today, checkInStreak: newStreak });
        
        return { success: true, reward };
      },

      purchaseItem: (itemId: string) => {
        const { shopItems, spendCoins } = get();
        const item = shopItems.find(i => i.id === itemId);
        
        if (!item || item.purchased) return false;
        
        if (spendCoins(item.price)) {
          set({
            shopItems: shopItems.map(i =>
              i.id === itemId ? { ...i, purchased: true } : i
            ),
          });
          return true;
        }
        return false;
      },

      completeMission: () => {
        const { currentMission, addCoins } = get();
        if (currentMission && !currentMission.completed) {
          addCoins(currentMission.reward);
          set({
            currentMission: { ...currentMission, completed: true },
          });
        }
      },

      initializeDailyMission: () => {
        const today = getTodayDate();
        const { currentMission } = get();
        
        // If no mission or mission is from a different day, create new one
        if (!currentMission || currentMission.date !== today) {
          set({ currentMission: getDailyMission(today) });
        }
      },
    }),
    {
      name: 'bia-dashboard-storage',
    }
  )
);
