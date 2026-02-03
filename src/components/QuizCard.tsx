import { motion } from 'framer-motion';
import { QuizQuestion } from '@/store/useJourneyStore';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
  disabled?: boolean;
}

const QuizCard = ({ question, currentIndex, totalQuestions, onAnswer, disabled }: QuizCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, rotateY: 15 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: -100, rotateY: -15 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Pergunta <span className="text-primary font-bold">{currentIndex + 1}</span> de {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx < currentIndex 
                  ? 'bg-success' 
                  : idx === currentIndex 
                    ? 'bg-primary animate-pulse-neon' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="glass-card p-6 border-glow-purple">
        {/* Question */}
        <h2 className="text-xl font-bold text-foreground mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !disabled && onAnswer(idx)}
              disabled={disabled}
              className="w-full p-4 text-left rounded-xl glass-card border border-border/50 
                hover:border-primary/50 hover:bg-primary/5 transition-all duration-300
                group relative overflow-hidden"
            >
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              
              <div className="flex items-center gap-4 relative z-10">
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center 
                  text-sm font-bold text-muted-foreground group-hover:bg-primary/20 
                  group-hover:text-primary transition-all duration-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                  {option}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dev Signature */}
      <p className="text-center text-xs text-muted-foreground mt-6 opacity-50">
        Feito com 💜 por Neemias
      </p>
    </motion.div>
  );
};

export default QuizCard;
