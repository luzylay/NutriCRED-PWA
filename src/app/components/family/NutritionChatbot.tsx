import { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";
import {
  evaluateNLUQuery,
  type NLUEvaluationResult,
} from "../../lib/i18n/nlu-engine";
import { tts } from "../../lib/i18n/tts-helper";
import type { LanguageCode } from "../../lib/i18n/translations";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  nlu?: NLUEvaluationResult;
  timestamp: Date;
}

const QUICK_PROMPTS: Record<LanguageCode, string[]> = {
  es: [
    "¿Qué darle de comer de 6 a 8 meses?",
    "¿Cómo prevenir la anemia infantil?",
    "¿Qué es la cinta MUAC y cómo se usa?",
    "¿Qué alimentos tienen más hierro?",
  ],
  qu: [
    "6 killayoq wawapaq mikhuykuna",
    "Yawar pisiyayta (anemia) jark'anapaq",
    "MUAC marq'a tupu yachachiynin",
    "Sangrecita hinaspa bazo mikhuynin",
  ],
  ay: [
    "6 phaxsini wawan manq'awipa",
    "Wila pisi (anemia) jark'añataki",
    "MUAC ampartupu yatichawipa",
    "K'ipcha ukat sangrecita manq'aña",
  ],
  en: [
    "Feeding guide for 6 to 8 months",
    "How to prevent child anemia?",
    "What is the MUAC color tape?",
    "Top iron-rich animal foods",
  ],
};

export function NutritionChatbot() {
  const { language, t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: t("chat.welcome"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null,
  );
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const prompts = QUICK_PROMPTS[language] || QUICK_PROMPTS.es;

  const handleSpeech = (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      tts.stop();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(messageId);
    tts.speak(text, {
      language,
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Process query using LLM with NLU Fallback
    const processMessage = async () => {
      try {
        const token = sessionStorage.getItem("active_token");
        const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: text, language }),
        });

        if (!response.ok) throw new Error("LLM offline");

        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          nlu: {
            intent: "general_nutrition",
            confidence: 0.99,
            detectedLanguage: language,
            isEmergencyTriage: false,
            replyText: data.reply,
            sourceRef: data.source || "IA (GPT)",
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        // Fallback to local NLU
        const nluResult = evaluateNLUQuery(text, language);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: nluResult.replyText,
          nlu: nluResult,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    };

    processMessage();
  };

  return (
    <div className="flex flex-col h-[450px] bg-card/60 backdrop-blur-md border border-border rounded-[2rem] overflow-hidden shadow-lg transition-all hover:shadow-xl">
      {/* Bot Chat Header */}
      <div className="bg-gradient-to-r from-primary to-accent px-5 py-4 flex items-center justify-between shadow-sm relative overflow-hidden">
        {/* Animated glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none animate-pulse"></div>
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-white/20 flex items-center justify-center">
            <MessageSquare className="size-4 text-white" />
          </div>
          <div>
            <span className="text-white text-xs font-bold uppercase tracking-wider block">
              Yanapiri Mikhuy
            </span>
            <span className="text-white/75 text-xs flex items-center gap-1">
              <Sparkles className="size-2.5" /> NLU Multilingüe + Triaje
            </span>
          </div>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-center gap-2">
          <AlertTriangle className="size-3.5" />
          Sin conexión: Respuestas limitadas a la base local. Usa La Despensa.
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/15">
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          const isEmergency = m.nlu?.isEmergencyTriage;
          const isPlayingThis = speakingMessageId === m.id;

          return (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed relative shadow-md transition-all ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm ml-auto"
                    : isEmergency
                      ? "bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 rounded-bl-sm"
                      : "bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 text-foreground rounded-bl-sm"
                }`}
              >
                {/* Emergency Triage Badge */}
                {isEmergency && (
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider mb-1.5 pb-1 border-b border-red-200 dark:border-red-800/50">
                    <AlertTriangle className="size-3.5" />
                    <span>{t("chat.triage_alert")}</span>
                  </div>
                )}

                <p className="whitespace-pre-line">{m.text}</p>

                {/* Source & Actions if bot */}
                {isBot && m.nlu?.sourceRef && (
                  <div className="mt-2 pt-1.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 truncate">
                      <BookOpen className="size-2.5 shrink-0" />
                      {m.nlu.sourceRef}
                    </span>
                    <button
                      onClick={() => handleSpeech(m.id, m.text)}
                      title={
                        isPlayingThis
                          ? t("app.audio_stop")
                          : t("app.audio_read")
                      }
                      className={`ml-2 p-1 rounded-lg transition-colors flex items-center gap-1 shrink-0 font-semibold ${
                        isPlayingThis
                          ? "bg-accent text-white animate-pulse"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {isPlayingThis ? (
                        <VolumeX className="size-3" />
                      ) : (
                        <Volume2 className="size-3" />
                      )}
                      <span className="text-xs">
                        {isPlayingThis ? "Detener" : "Escuchar"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground/60 px-1 mt-0.5 font-mono">
                {m.timestamp.toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Suggested chips in active language */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto border-t border-border bg-card/80 backdrop-blur-sm hide-scrollbar">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="text-xs bg-card hover:bg-primary hover:text-primary-foreground text-primary font-bold px-4 py-2 rounded-full shrink-0 border border-primary/20 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat input */}
      <div className="p-3 border-t border-border flex gap-2 bg-card/90 backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chat.placeholder")}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
          className="flex-1 bg-input-background/50 border border-border/80 rounded-2xl px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-input-background transition-all"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim()}
          className="size-11 bg-gradient-to-br from-primary to-accent disabled:opacity-50 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all shrink-0 cursor-pointer shadow-md"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}
