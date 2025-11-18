'use client'
import styles from './MusicCard.module.scss'
import { useState } from "react"
import { Music } from '@/app/services/musicService'
import {Genre} from '@/app/services/genresService'

interface MusicCardProps {
    music: Music[];
    genres: Genre
}

export default function MusicCard({music, genres} : MusicCardProps) {
    return (

    )
}