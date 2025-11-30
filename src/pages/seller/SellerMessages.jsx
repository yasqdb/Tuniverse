import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import logo2 from "../../img/logo2.jpeg";
import { getToken } from "../../auth";
import "./SellerMessages.css";

export default function SellerMessages() {
  const location = useLocation();
  const conversationId = location.state?.conversationId;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;
      try {
        const res = await fetch(
          `http://localhost:4000/api/conversations/${conversationId}`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === "" || !conversationId) return;
    try {
      const res = await fetch(
        `http://localhost:4000/api/conversations/${conversationId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ text: inputText }),
        },
      );
      const data = await res.json();
      setMessages(data.messages || []);
      setInputText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="messages-container">
      <div className="chat-area">
        {conversationId ? (
          <>
            <div className="chat-header">
              <img src={logo2} alt="pfp" />
              <h5>Conversation</h5>
            </div>
            <div className="messages-box">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message-bubble ${msg.senderId ? "them" : "me"}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>
            <div className="input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
