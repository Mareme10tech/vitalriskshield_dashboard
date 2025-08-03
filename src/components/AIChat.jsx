import { useState } from "react";
import axios from "axios";
import '../styles/AIChat.css'
import ReactMarkdown from "react-markdown";

export default function AIChat() {
  const openRouterKey = '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'; // replace with your OpenRouter API key

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-r1:free",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173", 
          },
        }
      );

      const reply = res.data.choices[0].message;
      console.log(reply);
      setMessages([...newMessages, reply]);
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  };

  return (
    <div className="main">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <strong>{msg.role}:</strong>
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
