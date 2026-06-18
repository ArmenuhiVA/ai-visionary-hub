import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function AIChatWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    await sendMessage({ text });
  };

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl glow-shadow transition hover:scale-110"
        aria-label="Open AI assistant"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
        <Brain className="relative h-6 w-6" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <div>
                <div className="font-display text-sm font-semibold">Varazdat AI</div>
                <div className="text-xs text-muted-foreground">Ask anything about my work</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
              {messages.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-6">
                  Hi! I'm an AI assistant trained on Dr. Varazdat's work. Ask me about courses, talks, or AI in general.
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.parts.map((p, i) =>
                      p.type === "text" ? (
                        <div key={i} className="prose prose-invert prose-sm max-w-none [&_p]:my-1">
                          <ReactMarkdown>{p.text}</ReactMarkdown>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex gap-1 text-muted-foreground">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "120ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "240ms" }} />
                </div>
              )}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2 border-t border-border p-3">
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button disabled={busy} className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
