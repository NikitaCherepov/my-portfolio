'use client'
import { usePlayerStore, usePlayerStateStore } from "@/app/store/useExitStore";
import { useEffect } from 'react';

export default function PlayerWatcher() {
  const { audio, setCurrentTime, setDuration } = usePlayerStateStore();
  const { volume } = usePlayerStore();

  useEffect(() => {
    if (!audio) return;

    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleMeta = () => {
      if (audio.duration) setDuration(audio.duration);
    };
    const handleEnded = () => {
      setCurrentTime(audio.duration || 0);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("loadedmetadata", handleMeta);
    audio.addEventListener("canplaythrough", handleMeta);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("loadedmetadata", handleMeta);
      audio.removeEventListener("canplaythrough", handleMeta);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio, setCurrentTime, setDuration]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [audio, volume]);

  return null;
}