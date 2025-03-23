import React, { useState } from "react";
import ChatInput from "../ChatInput";
import CustomAudioPlayer from "../CustomAudioPlayer";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      type: "text",
      text: "Привет! Как я могу помочь?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      type: "text",
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Имитация ответа бота
    setTimeout(() => {
      const botMsg = {
        type: "text",
        text: "Это автоответ от бота!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  // Функция для отправки аудиосообщения, которое можно прослушать
  const sendAudioMessage = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const newMsg = {
      type: "audio",
      audioUrl,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div
      className="relative flex flex-col bg-gray-100 overflow-hidden rounded-2xl"
      style={{ height: `calc( 100vh - 142px)` }}
    >
      {/* Окно сообщений */}
      <div className="flex-1 overflow-auto p-4 space-y-2 pb-20">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              key={index}
              className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.type === "text" ? (
                <p className="break-words">{msg.text}</p>
              ) : msg.type === "audio" ? (
                <CustomAudioPlayer audioUrl={msg.audioUrl} messageWidth={296} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {/* Компонент ввода, передаём функцию sendAudioMessage */}
      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        sendAudioMessage={sendAudioMessage}
      />
    </div>
  );
}
