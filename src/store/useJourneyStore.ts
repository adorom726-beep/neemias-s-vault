import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer_idx: number;
  success_message: string;
}

interface JourneyState {
  // Authentication
  isAuthenticated: boolean;
  
  // Quiz Progress
  currentQuestionIndex: number;
  answeredQuestions: Record<string, boolean>;
  isComplete: boolean;
  
  // UI States
  showingSuccess: boolean;
  showingError: boolean;
  
  // Actions
  authenticate: () => void;
  answerQuestion: (questionId: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  setShowingSuccess: (show: boolean) => void;
  setShowingError: (show: boolean) => void;
  completeJourney: () => void;
  resetJourney: () => void;
}

export const quizData: QuizQuestion[] = [
  {
    id: "1",
    question: "Onde eu te vi pela primeira vez e decidi mandar aquela mensagem?",
    options: ["Na escola", "No Instagram", "Numa festa", "Na rua"],
    correct_answer_idx: 1,
    success_message: "Exato. E foi a melhor DM que eu já mandei."
  },
  {
    id: "2",
    question: "Sobre a primeira mensagem... qual foi o estilo da cantada que funcionou?",
    options: ["Fofa", "Piada de tiozão", "Cantada mais quente", "Um 'Oi' seco"],
    correct_answer_idx: 2,
    success_message: "kkkkk não acredito que funcionou, mas valeu o risco."
  },
  {
    id: "3",
    question: "O que eu faço o dia todo no quarto?",
    options: ["Durmo", "Como", "Mexo no PC", "Tomo banho"],
    correct_answer_idx: 2,
    success_message: "Sempre no código (ou pensando em você)."
  },
  {
    id: "4",
    question: "Qual é a coisa EXATA que se eu fizer, você fica brava na hora?",
    options: ["Roubar sua comida", "Mexer no seu pé", "Demorar pra responder", "Falar do Flamengo"],
    correct_answer_idx: 1,
    success_message: "Eu juro que tento não mexer kkkk mas é mais forte que eu."
  },
  {
    id: "5",
    question: "Apesar da cara de bravo, qual é o meu verdadeiro ponto fraco com você?",
    options: ["Quando você me trata bem e faz carinho", "Quando você me dá presentes", "Elogios no meu código", "Lasanha"],
    correct_answer_idx: 0,
    success_message: "É... você me desmonta fácil."
  },
  {
    id: "6",
    question: "Antes da gente conversar, o que eu pensei de você só de ver o seu perfil?",
    options: ["Que era metida", "Que seria passageiro", "Que você era uma garota boa, legal e linda", "Que não ia me dar bola"],
    correct_answer_idx: 2,
    success_message: "E o faro do dev estava certo. Você é tudo isso e mais."
  }
];

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentQuestionIndex: 0,
      answeredQuestions: {},
      isComplete: false,
      showingSuccess: false,
      showingError: false,

      authenticate: () => set({ isAuthenticated: true }),

      answerQuestion: (questionId: string, isCorrect: boolean) => {
        if (isCorrect) {
          set((state) => ({
            answeredQuestions: { ...state.answeredQuestions, [questionId]: true },
            showingSuccess: true,
          }));
        } else {
          set({ showingError: true });
        }
      },

      nextQuestion: () => {
        const { currentQuestionIndex } = get();
        const nextIndex = currentQuestionIndex + 1;
        
        if (nextIndex >= quizData.length) {
          set({ isComplete: true, showingSuccess: false });
        } else {
          set({ currentQuestionIndex: nextIndex, showingSuccess: false });
        }
      },

      setShowingSuccess: (show: boolean) => set({ showingSuccess: show }),
      setShowingError: (show: boolean) => set({ showingError: show }),

      completeJourney: () => set({ isComplete: true }),

      resetJourney: () => set({
        isAuthenticated: false,
        currentQuestionIndex: 0,
        answeredQuestions: {},
        isComplete: false,
        showingSuccess: false,
        showingError: false,
      }),
    }),
    {
      name: 'bia-journey-storage',
    }
  )
);
