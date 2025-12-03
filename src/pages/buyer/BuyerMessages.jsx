


import React, { useState, useEffect, useRef, useCallback } from "react";
import logo2 from "../../img/logo2.jpeg";
import "./BuyerMessages.css";
import { useParams } from "react-router-dom";

export default function BuyerMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef(null);

  const { conversationId } = useParams();
  const buyerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const openConversation = useCallback(
      async (conv) => {
            setSelectedConv(conv);
            const res = await fetch(`http://localhost:4000/api/conversations/${conv._id}`, {
	            headers: { Authorization: `Bearer ${token}` },
	          });
            const data = await res.json();
            setMessages(data.messages);
          },
      [token],
    );

  useEffect(() => {
      const fetchConversations = async () => {
            try {
	            const res = await fetch(`http://localhost:4000/api/conversations/user/${buyerId}`, {
		              headers: { Authorization: `Bearer ${token}` },
		            });
	            const data = await res.json();
	            setConversations(data);

	            if (conversationId) {
		              const existingConv = data.find((c) => c._id === conversationId);
		              if (existingConv) {
			                  openConversation(existingConv);
			                } else {
					            setTimeout(async () => {
						                  const retryRes = await fetch(
								                  `http://localhost:4000/api/conversations/user/${buyerId}`,
								                  {
										                    headers: { Authorization: `Bearer ${token}` },
										                  },
								                );
						                  const retryData = await retryRes.json();
						                  setConversations(retryData);

						                  const conv = retryData.find((c) => c._id === conversationId);
						                  if (conv) openConversation(conv);
						                }, 500);
					          }
		            } else if (data.length > 0) {
			              openConversation(data[0]);
			            }
	          } catch (error) {
		          console.error("Error fetching conversations:", error);
		        }
          };
      fetchConversations();
    }, [buyerId, token, conversationId, openConversation]);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  const sendMessage = async () => {
      if (inputText.trim() === "") return;
      await fetch(`http://localhost:4000/api/conversations/${selectedConv._id}/message`, {
            method: "POST",
            headers: {
	            "Content-Type": "application/json",
	            Authorization: `Bearer ${token}`,
	          },
            body: JSON.stringify({ text: inputText }),
          });
      setMessages((prev) => [...prev, { senderId: buyerId, text: inputText }]);
      setInputText("");
    };

  return (
      <div className="messages-container">
        <div className="conversations-list">
          <h4 className="px-3 mt-3">Conversations</h4>
          <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>
          {conversations.map((conv) => (
	            <div
	              key={conv._id}
	              className={`conversation-item ${
		                    selectedConv?._id === conv._id ? "active" : ""
		                  }`}
	              onClick={() => openConversation(conv)}
	            >
	              <img src={logo2} alt="pfp" />
	              <span>@{conv.sellerId?.username || "Unknown"}</span>
	            </div>
	          ))}
        </div>

        <div className="chat-area">
          {selectedConv ? (
	            <>
	              <div className="chat-header">
	                <img src={logo2} alt="pfp" />
	                <h5>@{selectedConv.sellerId?.username || "Unknown"}</h5>
	              </div>
	              <div className="messages-box">
	                {messages.map((msg, i) => (
			                <div
			                  key={i}
			                  className={`message-bubble ${
					                      msg.senderId === buyerId ? "me" : "them"
					                    }`}
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
