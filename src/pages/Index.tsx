import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useJourneyStore } from '@/store/useJourneyStore';
import AuthScreen from '@/components/AuthScreen';
import QuizJourney from '@/components/QuizJourney';
import FinalScreen from '@/components/FinalScreen';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { isAuthenticated, isComplete } = useJourneyStore();
  const [showDashboard, setShowDashboard] = useState(false);

  // If journey complete and user dismissed final screen, show dashboard
  const shouldShowDashboard = isComplete && showDashboard;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <AuthScreen key="auth" />
        ) : shouldShowDashboard ? (
          <Dashboard key="dashboard" />
        ) : isComplete ? (
          <FinalScreen key="final" onContinue={() => setShowDashboard(true)} />
        ) : (
          <QuizJourney key="quiz" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
