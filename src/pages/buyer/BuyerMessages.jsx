import React, { useState, useEffect, useRef } from "react";
import logo2 from "../../img/logo2.jpeg";
import "./BuyerMessages.css";

export default function BuyerMessages() {
  // Mock conversations (replace with backend later)
  const mockConversations = {
    seller_1: [
      { from: "seller", text: "Hello! How can I help you?" },
      { from: "buyer", text: "I want something from Paris." },
      { from: "seller", text: "Sure, when do you need it?" },
    ],
    seller_2: [
      { from: "seller", text: "Hi! Looking for delivery assistance?" },
      { from: "buyer", text: "Yes, from Germany." },
    ],
  };

  const [selectedSeller, setSelectedSeller] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const bottomRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = (seller) => {
    setSelectedSeller(seller);
    setMessages(mockConversations[seller] || []);
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMsg = { from: "buyer", text: inputText };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <div className="messages-container">
      {/* LEFT SIDE — Conversations List */}
      <div className="conversations-list">
        <h4 className="px-3 mt-3">Conversations</h4>
        <button className="back-btn" onClick={() => window.history.back()}>
          ←
        </button>

        <div
          className={`conversation-item ${
            selectedSeller === "seller_1" ? "active" : ""
          }`}
          onClick={() => openConversation("seller_1")}
        >
          <img src={logo2} alt="pfp" />
          <span>@seller_1</span>
        </div>

        <div
          className={`conversation-item ${
            selectedSeller === "seller_2" ? "active" : ""
          }`}
          onClick={() => openConversation("seller_2")}
        >
          <img src={logo2} alt="pfp" />
          <span>@seller_2</span>
        </div>
      </div>

      {/* RIGHT SIDE — Chat Area */}
      <div className="chat-area">
        {selectedSeller ? (
          <>
            {/* Chat header */}
            <div className="chat-header">
              <img src={logo2} alt="pfp" />
              <h5>@{selectedSeller}</h5>
            </div>

            {/* Messages */}
            <div className="messages-box">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message-bubble ${
                    msg.from === "buyer" ? "me" : "them"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            {/* Message input */}
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
