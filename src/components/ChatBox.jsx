import { useState, useEffect, useRef } from "react";
import { askGemini } from "../api/gemini";
import ReactMarkdown from "react-markdown";
import { leapfrog } from 'ldrs'
leapfrog.register()

// I used https://uiball.com/ldrs/ for loading state of the ai api


function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showHistory, setShowHistory] = useState(false);

  const containerRef = useRef(null);
  const listRef = useRef(null);
  const inputRowRef = useRef(null);
  const MIN = 280;                            // px (start size)
  const MAX = typeof window !== "undefined" ? window.innerHeight * 0.70 : 600;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    let aiIndex;
    setMessages((prev) => {
      const updated = [...prev, { text: "", sender: "ai" }];
      aiIndex = updated.length - 1;
      return updated;
    });


    const reply = await askGemini(input);

    setMessages((prev) => {
      const updated = [...prev];
      if (updated[aiIndex]) updated[aiIndex].text = reply;
      return updated;
    });

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    // next tick after state clears, force reset to MIN
    setTimeout(() => applyAutoHeight(true), 0);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load saved history on mount
  const openHistory = () => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
    setShowHistory(true);
  };

  // Save whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);


  const applyAutoHeight = (force=false) => {
    const box = listRef.current;
    const inputRow = inputRowRef.current;
    const container = containerRef.current;
    if (!box || !inputRow || !container) return;

    const PADDING = 30;
    const natural = box.scrollHeight + inputRow.offsetHeight + PADDING;
    const clamped = Math.max(MIN, Math.min(natural, MAX));

    // Only grow when the last message is a *non-empty* AI reply,
    // or when we're forcing (e.g., on mount/clear)
    const last = messages[messages.length - 1];
    const aiJustResponded =
      last && last.sender === "ai" && last.text && last.text.trim().length > 0;

    if (force || aiJustResponded) {
      container.style.setProperty("--chat-h", `${clamped}px`);
      box.style.overflowY = natural > clamped ? "auto" : "hidden";
    } else if (messages.length === 0) {
      // brand-new state: snap back to min
      container.style.setProperty("--chat-h", `${MIN}px`);
      box.style.overflowY = "hidden";
    }
  };


  useEffect(() => { applyAutoHeight(); }, [messages]);
  useEffect(() => {
    applyAutoHeight(true);
    const onResize = () => applyAutoHeight(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="chat-wrapper">
      <div className="side-controls">
        <button className="clear-btn" onClick={clearChat}>Clear Chat</button>
        <button className="history-btn" onClick={() => setShowHistory(true)}>🕓 History</button>
      </div>

      {/* bind ref here */}
      <div className="chat-container" ref={containerRef}>
        {/* list ref */}
        <div className="chat-box" ref={listRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              {msg.sender === "ai" && <span className="icon">🤖</span>}
              <div className="bubble">
                  {msg.sender === "ai" && loading && i === messages.length - 1 &&
                    (!msg.text || msg.text.trim().length === 0) ? (
                      <l-leapfrog
                        size="30"
                        speed="2.5" 
                        color="white" 
                      ></l-leapfrog>
                    ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                  )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* input row ref */}
        <div className="chat-input" ref={inputRowRef}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="history-modal">
          <div className="history-content">
            <h3>Chat History</h3>
            {messages.length === 0 ? <p>No past conversations.</p> : (
              <div className="history-list">
                {messages.map((msg, i) => (
                  <div key={i} className={`history-item ${msg.sender}`}>
                    <strong>{msg.sender === "ai" ? "🤖 AI:" : "🧍You:"}</strong> {msg.text}
                  </div>
                ))}
              </div>
            )}
            <button className="close-history" onClick={() => setShowHistory(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
