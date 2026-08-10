import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Bot, Send, User } from "lucide-react";
import { startSpeechRecognition, speakText } from "../../lib/pwa-capabilities";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "¡Hola! Soy Yanapiri Mikhuy. Presiona el micrófono y pregúntame lo que desees sobre la alimentación de tu bebé.",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const speechRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (speechRef.current) {
      speechRef.current.stop();
      speechRef.current = null;
    }
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      setTranscript("");
      const rec = startSpeechRecognition(
        (res) => {
          setTranscript(res.transcript);
          if (res.isFinal) {
            stopListening();
            handleUserQuery(res.transcript);
          }
        },
        (err) => {
          console.warn("Reconocimiento de voz:", err);
          stopListening();
        },
        () => setIsListening(false),
      );
      if (rec) {
        recognitionRef.current = rec;
        setIsListening(true);
      }
    }
  };

  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setTranscript("");

    // Respuesta inteligente de nutrición
    let answerText = "La sangrecita de pollo es la fuente de hierro más económica y efectiva. Puedes dársela desmenuzada a partir de los 6 meses junto a papilla de camote o papa.";
    const lower = queryText.toLowerCase();

    if (lower.includes("anemia") || lower.includes("hierro")) {
      answerText = "Para combatir la anemia, prepara sangrecita, bazo de res o hígado 3 veces a la semana. Acompáñalo SIEMPRE con unas gotitas de limón o mandarina para duplicar su absorción.";
    } else if (lower.includes("leche") || lower.includes("calcio")) {
      answerText = "La leche materna es la mejor fuente de calcio. Si tu bebé ya consume sólidos, el queso fresco pasteurizado le ayudará a formar huesos fuertes.";
    } else if (lower.includes("estreñimiento") || lower.includes("agua")) {
      answerText = "A partir de los 6 meses, ofrece pequeños sorbos de agua hervida pura y granadilla o granos de quinua suave para mejorar la digestión.";
    }

    const botMsg: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: answerText };
    setMessages((prev) => [...prev, botMsg]);

    // Hablar la respuesta nativamente
    setIsSpeaking(true);
    const sp = speakText(answerText, () => setIsSpeaking(false));
    speechRef.current = sp;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-[2.5rem] max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
              <Bot className="size-6" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg leading-tight font-nunito flex items-center gap-2">
                Yanapiri Mikhuy Voice <Sparkles className="size-4 text-amber-500" />
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">Asistente de Voz Nativo ($0 Costo)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-2xl border border-border/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "bot" && (
                <div className="size-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs font-medium max-w-[80%] leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none font-bold"
                    : "bg-card border border-border text-foreground rounded-tl-none shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {transcript && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary animate-pulse flex items-center gap-2">
              <Mic className="size-4" /> Escuchando: "{transcript}"
            </div>
          )}
        </div>

        {/* Mic Control Bar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={toggleListening}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
            <span>{isListening ? "Escuchando... Presiona para parar" : "Hablar con Yanapiri Mikhuy"}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="size-12 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer shrink-0"
              title="Detener voz"
            >
              <VolumeX className="size-5 text-red-500" />
            </button>
          )}
        </div>

        <p className="text-[11px] text-center text-muted-foreground font-medium">
          💡 La voz utiliza la síntesis nativa de tu teléfono o navegador sin consumir datos.
        </p>

      </div>
    </div>
  );
}
