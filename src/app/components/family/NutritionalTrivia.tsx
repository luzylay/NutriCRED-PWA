import { useState } from "react";
import { Award, CheckCircle2, XCircle, HeartPulse, Sparkles, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const TRIVIA_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "¿Hasta qué edad se recomienda dar lactancia materna exclusiva (solo leche, sin agua ni mates)?",
    options: ["Hasta los 3 meses", "Hasta los 6 meses", "Hasta el año", "Hasta los 2 años"],
    correctAnswer: 1,
    explanation: "La OMS y el MINSA recomiendan la lactancia materna exclusiva hasta los 6 meses, ya que aporta todos los nutrientes y defensas que el bebé necesita.",
  },
  {
    id: 2,
    question: "¿Cuál de estos alimentos ayuda a combatir la anemia infantil porque tiene alto contenido de hierro?",
    options: ["Sangrecita y bazo", "Fideos y arroz", "Leche de vaca", "Caldo de pollo"],
    correctAnswer: 0,
    explanation: "La sangrecita, el hígado y el bazo son fuentes excelentes de hierro de origen animal (Hem), fundamentales para prevenir y tratar la anemia.",
  },
  {
    id: 3,
    question: "Al empezar a darle comidas a los 6 meses, ¿cómo debe ser la consistencia de la comida?",
    options: ["Sopas y caldos líquidos", "Solo jugos de frutas", "Purés o papillas espesas", "Trozos grandes de comida"],
    correctAnswer: 2,
    explanation: "A los 6 meses, las comidas deben ser espesas tipo puré o papilla. Las sopas o caldos llenan su estómago pero no los alimentan (baja densidad energética).",
  },
  {
    id: 4,
    question: "¿Con qué debo acompañar las comidas ricas en hierro para que el cuerpo lo absorba mejor?",
    options: ["Con mate de manzanilla", "Con limonada o refrescos de frutas cítricas", "Con leche", "Con café o té"],
    correctAnswer: 1,
    explanation: "La Vitamina C (limón, naranja, maracuyá) ayuda a que el cuerpo absorba mucho mejor el hierro de los alimentos.",
  }
];

export function NutritionalTrivia() {
  const [points, setPoints] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const question = TRIVIA_QUESTIONS[currentQuestionIdx];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    if (index === question.correctAnswer) {
      setPoints((prev) => prev + 50);
      triggerConfetti();
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < TRIVIA_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setGameFinished(false);
    setPoints(0);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#3b82f6", "#10b981", "#f59e0b"],
      zIndex: 100,
    });
  };

  if (gameFinished) {
    return (
      <div className="bg-card/60 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 text-center space-y-6 shadow-xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="size-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6 border-4 border-white/50">
            <Award className="size-12 text-white" />
          </div>
          <h3 className="text-3xl font-black font-nunito tracking-tight text-foreground mb-2">
            ¡Felicidades, Súper Mamá!
          </h3>
          <p className="text-muted-foreground text-lg mb-4">
            Has completado la trivia nutricional.
          </p>
          <div className="bg-white/40 dark:bg-black/40 rounded-2xl p-4 inline-block mb-6 shadow-sm border border-white/30">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Puntos Yanapiri</p>
            <p className="text-4xl font-black text-amber-500 font-mono">+{points}</p>
          </div>
          <button
            onClick={restartGame}
            className="w-full btn-gradient py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="size-5" /> Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Points */}
      <div className="flex items-center justify-between bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border border-amber-200 dark:border-amber-700/50">
            <Award className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Puntos Yanapiri</p>
            <p className="text-xl font-black text-foreground font-mono leading-none">{points}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pregunta</p>
          <p className="text-lg font-black text-primary font-mono leading-none">{currentQuestionIdx + 1} / {TRIVIA_QUESTIONS.length}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card/70 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        
        <h3 className="text-xl font-black text-foreground font-nunito leading-tight mb-6 relative z-10">
          {question.question}
        </h3>

        <div className="space-y-3 relative z-10">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswer;
            
            let btnClass = "bg-white/50 dark:bg-black/20 border-white/30 text-foreground hover:bg-white/80 dark:hover:bg-black/40 hover:border-primary/50";
            let icon = null;

            if (showResult) {
              if (isCorrect) {
                btnClass = "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-md ring-2 ring-emerald-500/20";
                icon = <CheckCircle2 className="size-5 text-emerald-500" />;
              } else if (isSelected) {
                btnClass = "bg-red-500/10 border-red-500 text-red-700 dark:text-red-300 opacity-70";
                icon = <XCircle className="size-5 text-red-500" />;
              } else {
                btnClass = "bg-white/30 dark:bg-black/10 border-transparent opacity-50";
              }
            } else if (isSelected) {
              btnClass = "bg-primary/10 border-primary text-primary";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm flex items-center justify-between cursor-pointer ${
                  !showResult && "active:scale-[0.98]"
                } ${btnClass}`}
              >
                <span className="pr-2">{opt}</span>
                {icon && <span className="shrink-0 animate-in zoom-in duration-300">{icon}</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation and Next Button */}
        {showResult && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed flex items-start gap-3 shadow-inner ${
              selectedOption === question.correctAnswer 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200" 
                : "bg-primary/10 border-primary/30 text-foreground"
            }`}>
              <div className="shrink-0 mt-0.5">
                {selectedOption === question.correctAnswer ? (
                  <Sparkles className="size-5" />
                ) : (
                  <HeartPulse className="size-5" />
                )}
              </div>
              <p>{question.explanation}</p>
            </div>
            
            <button
              onClick={nextQuestion}
              className="w-full bg-foreground text-background hover:bg-foreground/90 py-4 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {currentQuestionIdx < TRIVIA_QUESTIONS.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
