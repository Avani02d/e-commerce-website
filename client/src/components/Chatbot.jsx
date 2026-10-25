import { useState } from "react";
import { askAI } from "../services/api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi — I’m your Shopwise+ assistant. What are you looking for?" }]);
  const [loading, setLoading] = useState(false);

  async function send(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", text }]);
    setLoading(true);
    try {
      const result = await askAI(text);
      setMessages((current) => [...current, { role: "assistant", text: result.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", text: error.message }]);
    } finally { setLoading(false); }
  }

  return <div className="chatbot"><button className="chat-toggle" onClick={() => setOpen(!open)} aria-label="Open AI shopping assistant">{open ? "×" : "✦"}</button>{open && <section className="chat-panel"><div className="chat-header"><strong>Shopwise+ AI</strong><span>Shopping assistant</span></div><div className="chat-messages">{messages.map((message, index) => <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</p>)}{loading && <p className="chat-message assistant">Thinking…</p>}</div><form onSubmit={send} className="chat-form"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about products…" aria-label="Ask the AI assistant"/><button type="submit">↑</button></form></section>}</div>;
}
