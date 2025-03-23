import React, { useState, useRef } from "react";
import { FaMicrophone, FaTimes, FaTelegramPlane } from "react-icons/fa";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  sendAudioMessage,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false); // Новое состояние
  const touchStartX = useRef(0);
  const buttonRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    if (!input.trim()) {
      startRecording();
    }
  };

  const handleTouchMove = (e) => {
    if (!isRecording) return;
    const currentX = e.touches[0].clientX;
    const offset = touchStartX.current - currentX;

    // Рассчитываем прогресс свайпа (0-100%)
    const progress = Math.min(100, Math.max(0, (offset / 150) * 100));
    setSwipeProgress(progress);

    if (offset >= 80) {
      cancelRecording();
      return;
    }
  };

  const handleTouchEnd = () => {
    if (isRecording) {
      if (isCancelled) {
        // Дополнительная очистка при отмене
        audioChunks.current = [];
      } else if (swipeProgress < 80) {
        stopRecording();
      }
    }
    setSwipeProgress(0);
  };

  const cancelRecording = () => {
    setIsCancelled(true); // Устанавливаем флаг отмены
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      mediaRecorder.current = null;
    }
    setIsRecording(false);
    setSwipeProgress(0);
    audioChunks.current = [];
  };

  const startRecording = async () => {
    setIsCancelled(false); // Сбрасываем флаг отмены
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        if (
          !isCancelled &&
          swipeProgress < 80 &&
          audioChunks.current.length > 0
        ) {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/mp3",
          });
          sendAudioMessage(audioBlob);
        }
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 fixed bottom-0 left-0 w-full p-3 shadow-lg">
      {!isRecording && (
        <input
          type="text"
          className="flex-1 border p-2 rounded-lg outline-none"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}

      <div className="relative">
        {/* Индикатор свайпа */}
        {isRecording && (
          <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-20 h-8 bg-red-100 rounded-full flex items-center px-2">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-150"
              style={{ width: `${swipeProgress}%` }}
            />
            <span className="absolute w-full text-center text-xs text-red-500 font-medium">
              {swipeProgress >= 50 ? "Отпустите для отмены" : "Свайпните влево"}
            </span>
            <FaTimes className="ml-1 text-red-500" />
          </div>
        )}

        {/* Кнопка записи/отправки */}
        <button
          ref={buttonRef}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors
            ${
              input.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            }
            ${isRecording ? "animate-pulse bg-red-500" : ""}`}
          onClick={input.trim() ? sendMessage : null}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={!input.trim() ? startRecording : null}
          onMouseUp={!input.trim() ? stopRecording : null}
        >
          {input.trim() ? (
            <FaTelegramPlane className="text-white text-xl" />
          ) : (
            <FaMicrophone className="text-white text-xl" />
          )}
        </button>
      </div>
    </div>
  );
}
