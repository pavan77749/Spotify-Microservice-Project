import React, { useEffect, useRef, useState } from "react";
import { useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import WaveAnimation from "./WaveAnimation";




const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    IsPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showVolumeTooltip, setShowVolumeTooltip] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (IsPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!IsPlaying);
    }
  };

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    setShowVolumeTooltip(true);
    setTimeout(() => setShowVolumeTooltip(false), 1500);
  };

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <HiVolumeOff />;
    return <HiVolumeUp />;
  };

  const handleMuteToggle = () => {
    if (volume === 0) {
      const volumeToRestore = previousVolume > 0 ? previousVolume : 0.5;
      setVolume(volumeToRestore);
      if (audioRef.current) {
        audioRef.current.volume = volumeToRestore;
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log("Selected Song ID:", selectedSong);
    if (selectedSong) {
      fetchSingleSong();
    }
  }, [selectedSong]);

  return (
    <div>
      {song && (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          {/* Song Info Section with Wave Animation */}
          <div className="lg:flex items-center gap-4">
            <div className="relative">
              <img
                src={song.thumbnail ? song.thumbnail : "/download.png"}
                className={`w-12 rounded-lg transition-all duration-300 ${
                  IsPlaying ? 'shadow-lg shadow-green-400/30' : ''
                }`}
                alt=""
              />
              {/* Optional: Add a small play indicator on thumbnail */}
              {IsPlaying && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="hidden md:flex items-center">
              <div>
                <p className={`transition-colors duration-300 ${IsPlaying ? 'text-green-400' : ''}`}>
                  {song.title}
                </p>
                <p>{song.description?.slice(0, 30)}...</p>
              </div>
              
              
              <WaveAnimation IsPlaying={IsPlaying} />
              
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="flex flex-col items-center gap-1 m-auto">
            {song.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={IsPlaying} />
            )}

            {/* Progress bar with time display */}
            <div className="w-full items-center flex font-thin text-green-400 gap-2">
              <span className="text-xs text-gray-400 min-w-[35px]">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min={"0"}
                max={"100"}
                className="progress-bar w-[120px] md:w-[300px]"
                value={(progress / duration) * 100 || 0}
                onChange={durationChange}
              />
              <span className="text-xs text-gray-400 min-w-[35px]">
                {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer hover:text-green-400 transition-colors" onClick={prevSong}>
                <GrChapterPrevious />
              </span>

              <button
                className={`rounded-full p-2 transition-all duration-300 ${
                  IsPlaying 
                    ? 'bg-green-400 text-black shadow-lg shadow-green-400/30' 
                    : 'bg-white text-black hover:bg-green-400'
                }`}
                onClick={handlePlayPause}
              >
                {IsPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <span className="cursor-pointer hover:text-green-400 transition-colors" onClick={nextSong}>
                <GrChapterNext />
              </span>
            </div>
          </div>

          {/* Enhanced Volume Control Section */}
          <div className="flex items-center gap-2 relative">
            <span 
              className="text-lg cursor-pointer hover:text-gray-300 transition-colors" 
              onClick={handleMuteToggle}
              title={volume === 0 ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </span>
            
            <input
              type="range"
              className="w-16 md:w-32"
              min={"0"}
              max={"100"}
              step={"0.01"}
              value={volume * 100}
              onChange={volumeChange}
              onMouseEnter={() => setShowVolumeTooltip(true)}
              onMouseLeave={() => setShowVolumeTooltip(false)}
            />
            
            <span className="text-xs text-gray-400 min-w-[35px] hidden md:block">
              {Math.round(volume * 100)}%
            </span>
            
            {showVolumeTooltip && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                {Math.round(volume * 100)}%
              </div>
            )}
            
            <div className="hidden lg:flex items-end gap-1 ml-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-white transition-all duration-200 ${
                    volume > i * 0.2 
                      ? volume > 0.6 
                        ? 'h-4 bg-green-400' 
                        : volume > 0.3 
                        ? 'h-3 bg-yellow-400' 
                        : 'h-2 bg-red-400'
                      : 'h-1 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;