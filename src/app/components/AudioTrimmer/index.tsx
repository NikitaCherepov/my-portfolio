'use client';
import { useState, useRef, useEffect } from 'react';
import { trimAudioFile, formatTime } from '@/utils/audioUpload';
import { useTranslation } from 'react-i18next';
import styles from './AudioTrimmer.module.scss';

interface AudioTrimmerProps {
  value?: string; // URL текущего файла
  onChange?: (file: File | Blob) => void;
  disabled?: boolean;
}

export default function AudioTrimmer({ value, onChange, disabled = false }: AudioTrimmerProps) {
  const { t } = useTranslation();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [playbackStartTime, setPlaybackStartTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализация при наличии value
  useEffect(() => {
    if (value && !audioFile) {
      setAudioUrl(value);
      setEndTime(0); // Будет обновлено при загрузке метаданных
    }
  }, [value, audioFile]);

  // Очистка URL при размонтировании
  useEffect(() => {
    return () => {
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Обновление endTime при загрузке аудио
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      setDuration(audioDuration);
      if (endTime === 0) {
        setEndTime(Math.min(30, audioDuration)); // По умолчанию 30 секунд или вся длительность
      }
    }
  };

  // Обновление текущего времени
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Остановка воспроизведения
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }
    setIsPlaying(false);
  };

  // Воспроизведение fragment'а
  const playSegment = () => {
    if (!audioRef.current || isPlaying) return;

    audioRef.current.currentTime = startTime;
    setPlaybackStartTime(startTime);
    audioRef.current.play();
    setIsPlaying(true);

    // Остановка в конце fragment'а
    const segmentDuration = (endTime - startTime) * 1000;
    playbackTimeoutRef.current = setTimeout(() => {
      stopPlayback();
    }, segmentDuration);
  };

  // Обработка файла
  const handleFileSelect = (file: File) => {
    if (disabled) return;

    // Очищаем предыдущий URL если это blob
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setStartTime(0);
    setEndTime(0); // Сбросим, будет установлено в handleLoadedMetadata
    setIsPlaying(false);
    stopPlayback();

    if (onChange) {
      onChange(file);
    }
  };

  // Drag&Drop обработчики
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Обрезка аудио
  const handleTrim = async () => {
    if (!audioFile || startTime < 0 || endTime <= 0 || startTime >= endTime || isTrimming) return;

    setIsTrimming(true);
    try {
      const trimmedBlob = await trimAudioFile(audioFile, startTime, endTime);

      // Очищаем старый URL
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }

      // Создаем новый URL из обрезанного файла
      const newUrl = URL.createObjectURL(trimmedBlob);
      setAudioUrl(newUrl);

      // Обновляем endTime
      const segmentDuration = endTime - startTime;
      setEndTime(segmentDuration);
      setStartTime(0);

      if (onChange) {
        // Создаем File из Blob для сохранения
        const trimmedFile = new File([trimmedBlob], `trimmed_${audioFile.name}`, {
          type: trimmedBlob.type
        });
        onChange(trimmedFile);
      }

      stopPlayback();
    } catch (error) {
      console.error('Error trimming audio:', error);
      alert(t('audioTrimmer.error'));
    } finally {
      setIsTrimming(false);
    }
  };

  // Сброс обрезки
  const handleReset = () => {
    if (audioFile) {
      // Возвращаемся к оригинальному файлу
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }

      const originalUrl = URL.createObjectURL(audioFile);
      setAudioUrl(originalUrl);
      setStartTime(0);
      setEndTime(duration);
      stopPlayback();

      if (onChange) {
        onChange(audioFile);
      }
    }
  };

  return (
    <div className={styles.audioTrimmer}>
      <div className={styles.audioTrimmer__upload}>
        {audioUrl ? (
          <div className={styles.audioTrimmer__player}>
            <audio
              ref={audioRef}
              src={audioUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={stopPlayback}
            />

            <div className={styles.audioTrimmer__controls}>
              <button
                type="button"
                onClick={isPlaying ? stopPlayback : playSegment}
                disabled={!audioFile || duration === 0}
                className={styles.audioTrimmer__playButton}
              >
                {isPlaying ? t('audioTrimmer.pause') : t('audioTrimmer.play')}
              </button>

              <span className={styles.audioTrimmer__time}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {audioFile && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.audioTrimmer__changeButton}
                >
                  {t('audioTrimmer.replaceFile')}
                </button>
              )}
            </div>

            {duration > 0 && (
              <div className={styles.audioTrimmer__trimControls}>
                <div className={styles.audioTrimmer__slider}>
                  <label>{t('audioTrimmer.start')} {formatTime(startTime)}</label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => setStartTime(parseFloat(e.target.value))}
                    disabled={disabled}
                  />
                </div>

                <div className={styles.audioTrimmer__slider}>
                  <label>{t('audioTrimmer.end')} {formatTime(endTime)}</label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => setEndTime(parseFloat(e.target.value))}
                    disabled={disabled}
                  />
                </div>

                <div className={styles.audioTrimmer__actions}>
                  <button
                    type="button"
                    onClick={handleTrim}
                    disabled={disabled || isTrimming || startTime >= endTime || endTime === 0 || !audioFile}
                    className={styles.audioTrimmer__trimButton}
                  >
                    {isTrimming ? t('audioTrimmer.trimming') : t('audioTrimmer.trim')}
                  </button>

                  {audioFile && startTime !== 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={disabled || isTrimming}
                      className={styles.audioTrimmer__resetButton}
                    >
                      {t('audioTrimmer.reset')}
                    </button>
                  )}
                </div>

                <div className={styles.audioTrimmer__info}>
                  {t('audioTrimmer.fragmentDuration')} {formatTime(Math.max(0, endTime - startTime))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`${styles.audioTrimmer__dropZone} ${isDragging ? styles.audioTrimmer__dropZone_dragging : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className={styles.audioTrimmer__dropZoneContent}>
              <div className={styles.audioTrimmer__dropZoneIcon}>🎵</div>
              <div className={styles.audioTrimmer__dropZoneText}>
                {t('audioTrimmer.dropHere')}
              </div>
              <div className={styles.audioTrimmer__dropZoneHint}>
                {t('audioTrimmer.formats')}
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}