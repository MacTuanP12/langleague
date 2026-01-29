import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faVolumeDown } from '@fortawesome/free-solid-svg-icons';
import './audio-player.scss';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, className = '' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset error state when src changes
    setHasError(false);
    setErrorMessage('');

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
        setHasError(false); // Clear error if duration loads successfully
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => {
      setIsPlaying(true);
      setHasError(false); // Clear error if play succeeds
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      console.error('Audio loading error:', audio.error);
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      setHasError(true);

      // Check file extension for unsupported formats
      const fileExtension = src.toLowerCase().split('.').pop();
      const unsupportedFormats = ['wma', 'wav', 'aac', 'flac', 'ogg'];

      if (fileExtension && unsupportedFormats.includes(fileExtension)) {
        setErrorMessage(`Format .${fileExtension} may not be supported by your browser. Please use MP3 format for better compatibility.`);
      } else if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            setErrorMessage('Audio loading was aborted.');
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            setErrorMessage('Network error while loading audio.');
            break;
          case MediaError.MEDIA_ERR_DECODE:
            setErrorMessage('Audio decoding error. The file format may not be supported.');
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            setErrorMessage('Audio format not supported by your browser. Please use MP3 format.');
            break;
          default:
            setErrorMessage('Failed to load audio file.');
        }
      } else {
        setErrorMessage('Failed to load audio file.');
      }
    };
    const handleLoadedData = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
        setHasError(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newSpeed = parseFloat(e.target.value);
    audio.playbackRate = newSpeed;
    setPlaybackRate(newSpeed);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return faVolumeMute;
    if (volume < 0.5) return faVolumeDown;
    return faVolumeUp;
  };

  return (
    <div className={`audio-player ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      {hasError && (
        <div
          className="audio-player-error"
          style={{
            padding: '0.5rem',
            marginBottom: '0.5rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            color: '#856404',
          }}
        >
          <strong>⚠️ Audio Error:</strong> {errorMessage}
        </div>
      )}
      <div className="audio-player-main">
        <button
          type="button"
          className="audio-player-btn play-pause-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>

        <div className="audio-player-progress">
          <span className="audio-player-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="audio-player-seek"
            aria-label="Seek"
          />
          <span className="audio-player-time">{formatTime(duration)}</span>
        </div>

        <div className="audio-player-volume">
          <button type="button" className="audio-player-btn volume-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            <FontAwesomeIcon icon={getVolumeIcon()} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="audio-player-volume-slider"
            aria-label="Volume"
          />
        </div>

        <div className="audio-player-speed">
          <select value={playbackRate} onChange={handleSpeedChange} className="audio-player-speed-select" aria-label="Playback speed">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
