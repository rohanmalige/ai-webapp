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
  const [savedHistory, setSavedHistory] = useState([]);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const inputRowRef = useRef(null);
  const EMPTY_MIN = 180;  // initial empty height
  const ACTIVE_MIN = 280;
  const [chatHeight, setChatHeight] = useState(180); 
  const PADDING = 30;               
  const MAX = typeof window !== "undefined" ? window.innerHeight * 0.70 : 600;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    let aiIndex;
    setMessages((prev) => {
      const updated = [...prev, { text: "", sender: "ai"}];
      aiIndex = updated.length - 1;
      return updated;
    });

    try{
    const reply = await askGemini(input);

    setMessages((prev) => {
      const updated = [...prev];
      if (updated[aiIndex]) updated[aiIndex].text = reply;
      return updated;
    });
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
      if (updated[aiIndex]) {
        updated[aiIndex] = { sender: "ai", text: "Sorry, something went wrong. Please try again." };
      }
      return updated;
    });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setChatHeight(EMPTY_MIN);  // hard collapse
    if (listRef.current) listRef.current.style.overflowY = "hidden";

  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load saved history on mount
  const openHistory = () => {
    const saved = localStorage.getItem("chatHistory");
    setSavedHistory(saved ? JSON.parse(saved) : []);
    setShowHistory(true);
  };

  // Save whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);


  const applyAutoHeight = (force = false) => {
    const box = listRef.current;
    const inputRow = inputRowRef.current;
    const container = containerRef.current;
    if (!box || !inputRow || !container) return;


    const natural = box.scrollHeight + inputRow.offsetHeight + PADDING;
    const clampedActive = Math.max(
      ACTIVE_MIN,
      Math.min(natural, MAX)
    );

    const last = messages[messages.length - 1];
    const aiJustResponded = last && last.sender === "ai" && last.text && last.text.trim().length > 0;

    if (messages.length === 0) {
      return;
    }

    // has messages

    if (force || aiJustResponded) {
      setChatHeight(clampedActive);            
      box.style.overflowY = natural > clampedActive ? "auto" : "hidden";
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
        <button type="button" className="neon-btn neon-btn--red" onClick={clearChat}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Clear Chat
        </button>
        <button type="button" className="neon-btn neon-btn--green" onClick={openHistory}>  
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        🕓 History
        </button>
      </div>


      <div className="chat-container" ref={containerRef} style={{ height: `${chatHeight}px` }}>

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


        <div className="chat-input" ref={inputRowRef}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            //onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onKeyDown={(e) => !loading && e.key === "Enter" && sendMessage()}
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
            {(!savedHistory || savedHistory.length === 0) ? (
              <p>No past conversations.</p>
            ) : (
              <div className="history-list">
                {savedHistory.map((msg, i) => (
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
