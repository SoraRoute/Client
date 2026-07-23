import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { AI } from "../../api/endpoints";

const GREETING = {
  role: "assistant",
  content:
    "Hi! I'm the MarketHive shopping assistant. Ask me about products we carry — prices, brands, or recommendations.",
};

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm",
          isUser
            ? "bg-ink text-paper"
            : isError
              ? "bg-danger-50 text-danger-600"
              : "bg-paper-line/60 text-ink",
        ].join(" ")}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-paper-line/60 px-3.5 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted" />
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsSending(true);

    try {
      // The endpoint is stateless — it only ever sees this one message, not
      // the transcript — so no conversation history is sent here.
      const res = await axiosInstance.post(AI.CHAT, { message: trimmed });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: err.friendlyMessage || "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-paper-line bg-paper-raised shadow-pop">
          <div className="flex items-center justify-between border-b border-paper-line bg-ink px-4 py-3">
            <div className="flex items-center gap-2 text-paper">
              <Sparkles size={16} className="text-gold-500" />
              <span className="font-display text-sm font-semibold">MarketHive Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-paper/70 hover:bg-paper/10 hover:text-paper"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isSending ? <TypingBubble /> : null}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-paper-line p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a product…"
              disabled={isSending}
              className="flex-1 rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-ink hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-pop hover:bg-ink-soft"
        aria-label={isOpen ? "Close shopping assistant" : "Open shopping assistant"}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
