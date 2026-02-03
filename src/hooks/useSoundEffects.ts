import { useCallback, useRef } from 'react';

type SoundType = 'coin' | 'success' | 'error' | 'click' | 'purchase' | 'checkin' | 'mission' | 'levelup';

// Web Audio API based sound effects for crisp, instant playback
export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playSequence = useCallback((notes: { freq: number; dur: number; delay: number }[], type: OscillatorType = 'sine') => {
    notes.forEach(note => {
      setTimeout(() => playTone(note.freq, note.dur, type), note.delay * 1000);
    });
  }, [playTone]);

  const play = useCallback((sound: SoundType) => {
    switch (sound) {
      case 'coin':
        // Coin collect sound - bright ascending
        playSequence([
          { freq: 987, dur: 0.1, delay: 0 },
          { freq: 1319, dur: 0.15, delay: 0.1 },
        ], 'square');
        break;

      case 'success':
        // Success fanfare
        playSequence([
          { freq: 523, dur: 0.12, delay: 0 },
          { freq: 659, dur: 0.12, delay: 0.12 },
          { freq: 784, dur: 0.12, delay: 0.24 },
          { freq: 1047, dur: 0.3, delay: 0.36 },
        ], 'square');
        break;

      case 'error':
        // Error buzz
        playSequence([
          { freq: 200, dur: 0.15, delay: 0 },
          { freq: 150, dur: 0.2, delay: 0.15 },
        ], 'sawtooth');
        break;

      case 'click':
        // UI click
        playTone(800, 0.05, 'square', 0.15);
        break;

      case 'purchase':
        // Cash register / purchase sound
        playSequence([
          { freq: 523, dur: 0.08, delay: 0 },
          { freq: 659, dur: 0.08, delay: 0.08 },
          { freq: 784, dur: 0.08, delay: 0.16 },
          { freq: 1047, dur: 0.08, delay: 0.24 },
          { freq: 784, dur: 0.08, delay: 0.32 },
          { freq: 1047, dur: 0.2, delay: 0.4 },
        ], 'square');
        break;

      case 'checkin':
        // Daily check-in celebration
        playSequence([
          { freq: 440, dur: 0.1, delay: 0 },
          { freq: 554, dur: 0.1, delay: 0.1 },
          { freq: 659, dur: 0.1, delay: 0.2 },
          { freq: 880, dur: 0.25, delay: 0.3 },
        ], 'triangle');
        break;

      case 'mission':
        // Mission complete
        playSequence([
          { freq: 392, dur: 0.15, delay: 0 },
          { freq: 523, dur: 0.15, delay: 0.15 },
          { freq: 659, dur: 0.15, delay: 0.3 },
          { freq: 784, dur: 0.15, delay: 0.45 },
          { freq: 1047, dur: 0.4, delay: 0.6 },
        ], 'square');
        break;

      case 'levelup':
        // Level up / streak milestone
        playSequence([
          { freq: 523, dur: 0.1, delay: 0 },
          { freq: 659, dur: 0.1, delay: 0.1 },
          { freq: 784, dur: 0.1, delay: 0.2 },
          { freq: 1047, dur: 0.1, delay: 0.3 },
          { freq: 1319, dur: 0.1, delay: 0.4 },
          { freq: 1568, dur: 0.3, delay: 0.5 },
        ], 'square');
        break;
    }
  }, [playTone, playSequence]);

  return { play };
};
