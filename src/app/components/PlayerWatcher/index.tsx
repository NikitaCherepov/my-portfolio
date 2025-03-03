'use client'
import { usePlayerStore } from "@/app/store/useExitStore";
import { usePlayerStateStore } from "@/app/store/useExitStore";
import {useEffect} from 'react'

export default function PlayerWatcher() {
    const {audio, setCurrentTime, setDuration} = usePlayerStateStore();
    const {volume} = usePlayerStore();

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
    }, [audio, setCurrentTime, setDuration])

    useEffect(() => {
        if (audio) {
            audio.volume = volume;
        }
    }, [audio, volume])

    return null;
}