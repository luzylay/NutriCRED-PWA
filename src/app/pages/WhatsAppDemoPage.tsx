import { useState } from "react";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import { HeaderActions } from "../components/shared/HeaderActions";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
}

export default function WhatsAppDemoPage() {
  const { logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy Yanapiri, tu asistente del MINSA. 🇵🇪\nPara registrar el peso de hoy de tu wawa, responde con su peso en kilos (ejemplo: 8.5).",
      sender: "bot",
      time: "10:00",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      let reply = "";
      if (input.includes("talla")) {
        reply =
          "¡Talla registrada exitosamente! 🎉 Está creciendo muy bien. ¿Algo más en que pueda ayudarte?";
      } else if (!isNaN(parseFloat(input))) {
        reply = `¡Anotado! ${input} kg guardados en el historial de tu bebé. 📝\n\n¿Podrías enviarme también su talla en centímetros? (ejemplo: talla 72)`;
      } else {
        reply =
          "No entendí muy bien. Recuerda enviarme solo el número de su peso, o la palabra 'talla' seguida de los centímetros.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          sender: "bot",
          time: new Date().toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 pt-12 pb-6 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              Modo Cero Saldo <br />
              <span className="text-emerald-200 font-medium">
                Demo WhatsApp
              </span>
            </h1>
            <p className="text-white/80 mt-2 text-sm max-w-[260px] leading-relaxed">
              Así es como una familia sin megas registrará datos usando WhatsApp
              gratis.
            </p>
          </div>
          <HeaderActions onLogout={logout} />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start pt-6 px-4">
        {/* WhatsApp Phone Mockup */}
        <div className="w-full max-w-md bg-[#efeae2] rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden flex flex-col h-[600px] relative">
          {/* WA Header */}
          <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                Y
              </div>
              <div>
                <h2 className="font-bold leading-tight">Yanapiri MINSA</h2>
                <span className="text-xs text-white/80">en línea</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Video className="size-5" />
              <Phone className="size-5" />
              <MoreVertical className="size-5" />
            </div>
          </div>

          {/* WA Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-opacity-10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm relative ${
                    msg.sender === "user"
                      ? "bg-[#d9fdd3] rounded-tr-none"
                      : "bg-white rounded-tl-none"
                  }`}
                >
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-500">
                      {msg.time}
                    </span>
                    {msg.sender === "user" && (
                      <CheckCheck className="size-3 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WA Input */}
          <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Mensaje"
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="size-10 bg-[#00a884] rounded-full flex items-center justify-center text-white shrink-0 hover:bg-[#008f6f] transition-colors"
            >
              <Send className="size-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
