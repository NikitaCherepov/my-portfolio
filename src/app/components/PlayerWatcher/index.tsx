'use client'
import { usePlayerStore } from "@/app/store/useExitStore";
import { usePlayerStateStore } from "@/app/store/useExitStore";
import {useState, useRef, useEffect} from 'react'

export default function PlayerWatcher({src, state}: any) {
    const {audio, setAudio, currentTime, setCurrentTime, setDuration} = usePlayerStateStore();

    useEffect(() => {
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        }
        audio.addEventListener("loadedmetadata", () => {
            if (audio.duration) {setDuration(audio.duration)};
          });

        audio.addEventListener("timeupdate", updateTime);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
        }
    }, [audio])

    return null;
}