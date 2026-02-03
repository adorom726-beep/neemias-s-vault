import { AnimatePresence } from 'framer-motion';
import { useJourneyStore } from '@/store/useJourneyStore';
import AuthScreen from '@/components/AuthScreen';
import QuizJourney from '@/components/QuizJourney';
import FinalScreen from '@/components/FinalScreen';

const Index = () => {
  const { isAuthenticated, isComplete } = useJourneyStore();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <AuthScreen key="auth" />
        ) : isComplete ? (
          <FinalScreen key="final" />
        ) : (
          <QuizJourney key="quiz" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
