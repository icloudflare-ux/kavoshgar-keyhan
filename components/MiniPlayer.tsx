
import React from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const MiniPlayer: React.FC = () => {
    const { 
        currentChapter, 
        isPlaying, 
        progress, 
        duration,
        playbackRate,
        togglePlayPause, 
        seek, 
        setPlaybackRate,
        closePlayer 
    } = useAudioPlayer();

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seek(parseFloat(e.target.value));
    };
    
    const currentTime = (progress / 100) * duration;
    
    const chapterTitle = currentChapter?.titleKey ? currentChapter.titleKey
        .replace('library_', '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') : 'پخش';


    return (
        <AnimatePresence>
            {currentChapter && (
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-[60]"
                >
                    <div className="bg-purple-900/40 backdrop-blur-xl border border-amber-400/30 rounded-2xl shadow-2xl shadow-purple-900/50 p-4 text-white flex items-center gap-4">
                        <span className="text-4xl">{currentChapter.icon}</span>
                        <div className="flex-grow min-w-0">
                            <h4 className="font-lalezar text-lg leading-tight truncate">{chapterTitle}</h4>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="font-roboto-mono text-xs w-12 text-center">{formatTime(currentTime)}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-amber-400"
                                />
                                <span className="font-roboto-mono text-xs w-12 text-center">{formatTime(duration)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <button className="font-roboto-mono text-sm px-2 py-1 rounded-md bg-black/20 hover:bg-black/40">{playbackRate}x</button>
                                <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-slate-800 p-1 rounded-lg hidden group-hover:flex flex-col gap-1 z-10">
                                    {[1, 1.25, 1.5, 2].map(rate => (
                                        <button key={rate} onClick={() => setPlaybackRate(rate)} className={`px-3 py-1 text-sm rounded ${playbackRate === rate ? 'bg-indigo-600' : 'hover:bg-indigo-800'}`}>{rate}x</button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={togglePlayPause} className="w-10 h-10 flex items-center justify-center bg-amber-400 text-black rounded-full shadow-lg">
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
                                )}
                            </button>
                             <button onClick={closePlayer} className="w-8 h-8 flex items-center justify-center bg-black/20 text-gray-300 hover:text-white rounded-full">
                                &times;
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MiniPlayer;
