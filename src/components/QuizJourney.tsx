import { AnimatePresence } from 'framer-motion';
import { useJourneyStore, quizData } from '@/store/useJourneyStore';
import QuizCard from './QuizCard';
import SuccessOverlay from './SuccessOverlay';
import ErrorOverlay from './ErrorOverlay';

const QuizJourney = () => {
  const { 
    currentQuestionIndex, 
    showingSuccess, 
    showingError,
    answerQuestion,
    nextQuestion,
    setShowingError 
  } = useJourneyStore();

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correct_answer_idx;
    answerQuestion(currentQuestion.id, isCorrect);
  };

  const handleContinue = () => {
    nextQuestion();
  };

  const handleRetry = () => {
    setShowingError(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden noise">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/10 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-pink/5 rounded-full blur-3xl" />

      {/* Quiz Card */}
      <AnimatePresence mode="wait">
        <QuizCard
          key={currentQuestion.id}
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={quizData.length}
          onAnswer={handleAnswer}
          disabled={showingSuccess || showingError}
        />
      </AnimatePresence>

      {/* Overlays */}
      <AnimatePresence>
        {showingSuccess && (
          <SuccessOverlay
            message={currentQuestion.success_message}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showingError && (
          <ErrorOverlay onRetry={handleRetry} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizJourney;
