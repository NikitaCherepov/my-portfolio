/**
 * Утилиты для работы с аудиофайлами на клиенте
 */

/**
 * Валидация аудиофайла
 */
export function validateAudioFile(file: File): boolean {
  const allowedTypes = [
    'audio/mpeg',     // MP3
    'audio/wav',      // WAV
    'audio/ogg',      // OGG
    'audio/m4a',      // M4A/AAC
    'audio/mp3',      // MP3 (alternative)
    'audio/x-wav'     // WAV (alternative)
  ];
  const maxSize = 50 * 1024 * 1024; // 50MB для аудио

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only MP3, WAV, OGG, and M4A audio files are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 50MB.');
  }

  return true;
}

/**
 * Обрезает аудиофайл с помощью Web Audio API
 */
export async function trimAudioFile(file: File, startTime: number, endTime: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    file.arrayBuffer().then(arrayBuffer => {
      return audioContext.decodeAudioData(arrayBuffer);
    }).then(audioBuffer => {
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const frameCount = endSample - startSample;

      if (frameCount <= 0) {
        throw new Error('Invalid time range');
      }

      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        frameCount,
        sampleRate
      );

      // Копируем данные для каждого канала
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const trimmedData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          trimmedData[i] = channelData[startSample + i];
        }
      }

      // Конвертируем обратно в Blob
      const offlineContext = new OfflineAudioContext(
        trimmedBuffer.numberOfChannels,
        trimmedBuffer.length,
        trimmedBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = trimmedBuffer;
      source.connect(offlineContext.destination);
      source.start();

      return offlineContext.startRendering();
    }).then(renderedBuffer => {
      // Экспорт в WAV
      const wavBlob = audioBufferToWav(renderedBuffer);
      resolve(wavBlob);
    }).catch(error => {
      reject(error);
    });
  });
}

/**
 * Конвертирует AudioBuffer в WAV формат
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numberOfChannels * 2 + 44;
  const outputBuffer = new ArrayBuffer(length);
  const view = new DataView(outputBuffer);
  const channels = [];
  let offset = 0;
  let pos = 0;

  // Заголовок WAV файла
  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };

  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // RIFF identifier
  setUint32(0x46464952);
  // file length
  setUint32(length - 8);
  // RIFF type
  setUint32(0x45564157);
  // format chunk identifier
  setUint32(0x20746d66);
  // format chunk length
  setUint32(16);
  // sample format (raw)
  setUint16(1);
  // channel count
  setUint16(numberOfChannels);
  // sample rate
  setUint32(buffer.sampleRate);
  // byte rate
  setUint32(buffer.sampleRate * numberOfChannels * 2);
  // block align
  setUint16(numberOfChannels * 2);
  // bits per sample
  setUint16(16);
  // data chunk identifier
  setUint32(0x61746164);
  // data chunk length
  setUint32(length - pos - 4);

  // Записываем данные
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numberOfChannels; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([outputBuffer], { type: 'audio/wav' });
}

/**
 * Форматирует время в секунды в формат MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}