import React, { useState, useRef, useEffect } from 'react';
import './AIChatbox.css';
import { MdSend, MdChatBubbleOutline } from 'react-icons/md';

const DUMMY_AI_RESPONSE = [
  "Xin chào! Tôi có thể giúp gì cho bạn?",
  "Bạn cần tư vấn về sản phẩm nào?",
  "Cảm ơn bạn đã liên hệ TechStore!"
];

function AIChatbox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Xin chào! Tôi là trợ lý AI của TechStore.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    // Giả lập trả lời AI (có thể thay bằng API OpenAI ở đây)
    setTimeout(() => {
      const aiText = DUMMY_AI_RESPONSE[Math.floor(Math.random() * DUMMY_AI_RESPONSE.length)];
      setMessages(msgs => [...msgs, { from: 'ai', text: aiText }]);
    }, 900);
  };

  return (
    <div className={`ai-chatbox-root${open ? ' open' : ''}`}>
      {!open && (
        <button className="ai-chatbox-toggle" onClick={() => setOpen(true)}>
          <MdChatBubbleOutline size={28} />
        </button>
      )}
      {open && (
        <div className="ai-chatbox-window">
          <div className="ai-chatbox-header">
            <span>🤖 Chat AI TechStore</span>
            <button className="ai-chatbox-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="ai-chatbox-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-chatbox-msg ${msg.from}`}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form className="ai-chatbox-inputbar" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="ai-chatbox-send"><MdSend size={22} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AIChatbox;
