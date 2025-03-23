import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function CustomAudioPlayer({ audioUrl, messageWidth }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;

      const updateMetadata = () => {
        if (!isFinite(audio.duration)) {
          console.error("Некорректная длительность аудио");
          return;
        }
        setDuration(formatTime(audio.duration));
      };

      audio.addEventListener("loadedmetadata", updateMetadata);
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(formatTime(audio.currentTime));
        setProgress((audio.currentTime / audio.duration) * 100);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        audio.currentTime = 0;
        setProgress(0);
      });

      return () => {
        audio.removeEventListener("loadedmetadata", updateMetadata);
        audio.pause();
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      // Повторная проверка длительности при старте
      if (!isFinite(audio.duration)) {
        console.error("Ошибка: аудио имеет бесконечную длительность");
        return;
      }
    } else {
      audio.pause();
    }
    setIsPlaying(!audio.paused);
  };

  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg"
      style={{ width: messageWidth }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        onClick={togglePlayPause}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-sm text-gray-600 min-w-[80px] text-right">
        {currentTime} / {duration}
      </span>
    </div>
  );
}
