import { useState } from "react";

function ChatBox({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Mock AI response for now
    setTimeout(() => {
      const aiMessage = {
        sender: "ai",
        text: `🤖 AI says: "${userMessage.text}" sounds interesting!`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <h1>AI Chat 💬</h1>
      <div className="chat-box">
        {messages.length === 0 && (
          <p className="placeholder">Start chatting with your AI assistant!</p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="loading">AI is typing...</p>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <button className="hover-border dark back-btn" onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

export default ChatBox;
