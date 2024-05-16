"use client"

import React, { useState } from "react";



const MyChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const API_KEY = "sk-proj-yFxVCIA5orooulkgCdPdT3BlbkFJJRl0nhVCTQj5pSwqoArG"; // Paste your API key here

  const handleChat = () => {
    if (!userMessage) return;

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { message: userMessage, className: "outgoing" },
    ]);
    setUserMessage("");

    setTimeout(() => {
      generateResponse(userMessage);
    }, 600);
  };

  const generateResponse = (message) => {
    const API_URL = "PASTE-API-URL-HERE"; // Replace with the actual API URL

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    };

    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const response = data.choices[0].message.content.trim();
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { message: response, className: "incoming" },
        ]);
      })
      .catch(() => {
        const errorResponse = "Oops! Something went wrong. Please try again.";
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { message: errorResponse, className: "incoming error" },
        ]);
      });
  };

  return (
    <div className="chatbot">
      <div>
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          {chatLog.map((item, index) => (
            <li key={index} className={`chat ${item.className}`}>
              {item.message}
            </li>
          ))}
        </ul>
        <div className="chat-input">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter a message..."
            spellCheck="false"
            required
          />
          <span
            id="send-btn"
            className="material-symbols-rounded"
            onClick={handleChat}
          >
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyChatBot;
