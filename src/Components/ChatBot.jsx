import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "What are your skills?",
  "Tell me about projects",
  "How to contact you?",
  "Download resume?",
  "Your certificates?",
];

// ── Streaming word-by-word animation ──────────────────────────────
function StreamingMessage({ content, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    // Split into characters for smooth streaming feel
    const chars = content.split("");
    
    const interval = setInterval(() => {
      if (indexRef.current < chars.length) {
        // Add 2-4 chars at a time for natural speed
        const chunkSize = Math.floor(Math.random() * 3) + 2;
        const next = chars
          .slice(indexRef.current, indexRef.current + chunkSize)
          .join("");
        setDisplayed((prev) => prev + next);
        indexRef.current += chunkSize;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, 18); // Speed: lower = faster

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="relative">
      <FormattedMessage content={displayed} />
      {!done && (
        <motion.span
          className="inline-block w-0.5 h-3.5 ml-0.5 rounded-full align-middle"
          style={{ background: "#0047AB" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}


// ── Format message into clean JSX ─────────────────────────────────
function FormattedMessage({ content }) {
  // Normalize: collapse multiple newlines into max 2
  const normalized = content
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const blocks = normalized.split('\n\n')

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean)

        return (
          <div key={bi} className="flex flex-col gap-1">
            {lines.map((line, li) => {
              // Bullet: - or * or •
              if (/^[-*•]\s+/.test(line)) {
                const text = line.replace(/^[-*•]\s+/, '')
                return (
                  <div key={li} className="flex items-start gap-2">
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: '#0047AB', marginTop: '7px' }}
                    />
                    <span className="text-white/85 leading-snug">
                      {renderInline(text)}
                    </span>
                  </div>
                )
              }

              // Numbered list: 1. 2. etc
              if (/^\d+\.\s+/.test(line)) {
                const num = line.match(/^(\d+)\./)[1]
                const text = line.replace(/^\d+\.\s+/, '')
                return (
                  <div key={li} className="flex items-start gap-2">
                    <span
                      className="text-xs font-bold flex-shrink-0"
                      style={{ color: '#0047AB', minWidth: '14px', marginTop: '2px' }}
                    >
                      {num}.
                    </span>
                    <span className="text-white/85 leading-snug">
                      {renderInline(text)}
                    </span>
                  </div>
                )
              }

              // Label: value pattern (e.g. "Email: xyz@gmail.com")
              if (/^[^:]{1,20}:\s.+/.test(line)) {
                const colonIdx = line.indexOf(':')
                const label = line.slice(0, colonIdx).trim()
                const value = line.slice(colonIdx + 1).trim()
                return (
                  <div key={li} className="flex items-start gap-1 flex-wrap leading-snug">
                    <span className="font-semibold text-white flex-shrink-0">
                      {label}:
                    </span>
                    <span className="text-white/75">{renderInline(value)}</span>
                  </div>
                )
              }

              // Regular line
              return (
                <p key={li} className="text-white/85 leading-snug">
                  {renderInline(line)}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 rounded text-xs font-mono"
          style={{ background: '#0047AB22', color: '#60a5fa' }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// ── Main ChatBot Component ─────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Aizaz's AI assistant. Ask me anything about his skills, projects, education, or how to hire him!",
      streaming: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || isLoading) return;

    setShowSuggestions(false);
    const userMsg = { role: "user", content: text.trim(), streaming: false };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        "Something went wrong. Reach Aizaz at aizazahmed098@gmail.com";

      // Add message with streaming: true — triggers word-by-word animation
      setMessages([
        ...updated,
        { role: "assistant", content: reply, streaming: true },
      ]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content:
            "Network error. Contact Aizaz at aizazahmed098@gmail.com or WhatsApp +923008925097",
          streaming: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Called when streaming animation finishes — marks message as done
  const handleStreamDone = (index) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, streaming: false } : m))
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! 👋 I'm Aizaz's AI assistant. Ask me anything about his skills, projects, education, or how to hire him!",
        streaming: false,
      },
    ]);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,71,171,0.6)]"
        style={{ background: "linear-gradient(135deg, #0047AB, #002966)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="w-5 h-5"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Unread dot ── */}
      <AnimatePresence>
        {!isOpen && hasNewMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-[76px] right-6 z-[999] w-3 h-3 bg-red-500 rounded-full border-2 border-black"
          />
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-[998] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,71,171,0.2)]"
            style={{ width: "360px", height: "500px", background: "#090909" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0047AB, #002966)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-4 h-4"
                  >
                    <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">
                    Aizaz's AI Assistant
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/60 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={clearChat}
                title="Clear chat"
                className="text-white/50 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex items-end gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Bot avatar */}
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border border-[#0047AB]/40 bg-[#0047AB]/10 mb-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#0047AB"
                        className="w-3 h-3"
                      >
                        <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "rounded-br-sm text-white"
                        : "rounded-bl-sm text-white/85 border border-white/5"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #0047AB, #002966)",
                          }
                        : { background: "#1c1c1c" }
                    }
                  >
                    {msg.role === "assistant" ? (
                      msg.streaming ? (
                        <StreamingMessage
                          content={msg.content}
                          onDone={() => handleStreamDone(i)}
                        />
                      ) : (
                        <FormattedMessage content={msg.content} />
                      )
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing dots — only shown while waiting for API */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-end gap-2 justify-start"
                  >
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border border-[#0047AB]/40 bg-[#0047AB]/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#0047AB"
                        className="w-3 h-3"
                      >
                        <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5"
                      style={{ background: "#1c1c1c" }}
                    >
                      <div className="flex gap-1 items-center h-3">
                        {[0, 1, 2].map((j) => (
                          <motion.span
                            key={j}
                            className="w-1.5 h-1.5 rounded-full bg-[#0047AB]"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.55,
                              repeat: Infinity,
                              delay: j * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestion chips */}
              <AnimatePresence>
                {showSuggestions && messages.length === 1 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2 pt-1"
                  >
                    <p className="text-white/25 text-xs pl-8">Try asking:</p>
                    <div className="flex flex-wrap gap-2 pl-8">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="text-xs px-3 py-1.5 rounded-full border border-[#0047AB]/40 text-[#0047AB] hover:bg-[#0047AB]/10 transition-colors"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div
              className="flex-shrink-0 p-3 border-t border-white/5"
              style={{ background: "#0f0f0f" }}
            >
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 text-white text-sm rounded-xl px-3.5 py-2.5 outline-none border border-white/10 focus:border-[#0047AB] transition-colors placeholder-white/25 disabled:opacity-40"
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #0047AB, #002966)",
                  }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-4 h-4"
                  >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-white/15 text-xs text-center mt-2 tracking-wide">
                Created By Aizaz Ahmed | All rights reserved © 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
