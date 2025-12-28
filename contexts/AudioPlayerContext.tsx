
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { LibraryChapter } from '../data/cosmicLibraryData';
import { libraryContent } from '../data/libraryContent';

interface AudioPlayerState {
    currentChapter: LibraryChapter | null;
    isPlaying: boolean;
    progress: number; // 0 to 100
    duration: number; // in seconds
    playbackRate: number;
}

interface AudioPlayerContextType extends AudioPlayerState {
    playChapter: (chapter: LibraryChapter) => void;
    togglePlayPause: () => void;
    seek: (percentage: number) => void;
    setPlaybackRate: (rate: number) => void;
    closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

const getPlaybackPosition = (chapterId: string) => {
    try {
        const item = localStorage.getItem(`audio_progress_${chapterId}`);
        return item ? parseInt(item, 10) : 0;
    } catch (e) {
        return 0;
    }
};

const setPlaybackPosition = (chapterId: string, charIndex: number) => {
    try {
        localStorage.setItem(`audio_progress_${chapterId}`, String(charIndex));
    } catch (e) {
        // Ignore storage errors
    }
};

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AudioPlayerState>({
        currentChapter: null,
        isPlaying: false,
        progress: 0,
        duration: 0,
        playbackRate: 1,
    });
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const originalTextRef = useRef<string>('');

    const stopPlayback = useCallback(() => {
        speechSynthesis.cancel();
        setState(prev => ({ ...prev, isPlaying: false, currentChapter: null, progress: 0 }));
        utteranceRef.current = null;
    }, []);

    const playChapter = useCallback((chapter: LibraryChapter) => {
        // If it's the same chapter, just toggle play/pause
        if (state.currentChapter?.id === chapter.id) {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
                setState(prev => ({ ...prev, isPlaying: true }));
            } else if (speechSynthesis.speaking) {
                speechSynthesis.pause();
                setState(prev => ({ ...prev, isPlaying: false }));
            }
            return;
        }

        stopPlayback();
        
        const content = libraryContent[chapter.contentKey] || '';
        const text = content.replace(/<[^>]*>/g, ' ').trim();
        if (!text) return;
        
        originalTextRef.current = text;
        const savedCharIndex = getPlaybackPosition(chapter.id);
        const textToSpeak = text.substring(savedCharIndex);

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utteranceRef.current = utterance;
        
        // Find a Persian voice
        const voices = speechSynthesis.getVoices();
        const persianVoice = voices.find(v => v.lang.startsWith('fa'));
        if (persianVoice) {
            utterance.voice = persianVoice;
        }
        utterance.rate = state.playbackRate;

        const estimatedDuration = Math.ceil(text.split(/\s+/).length / (2.5 * state.playbackRate)); // ~150 WPM
        
        utterance.onend = () => {
            setPlaybackPosition(chapter.id, 0); // Reset on end
            stopPlayback();
        };

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const totalChars = originalTextRef.current.length;
                const currentCharIndex = savedCharIndex + event.charIndex;
                const newProgress = totalChars > 0 ? (currentCharIndex / totalChars) * 100 : 0;
                setState(prev => ({ ...prev, progress: newProgress }));
                setPlaybackPosition(chapter.id, currentCharIndex);
            }
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error', event);
            stopPlayback();
        };

        speechSynthesis.speak(utterance);
        
        const totalChars = text.length;
        setState(prev => ({
            ...prev,
            currentChapter: chapter,
            isPlaying: true,
            progress: totalChars > 0 ? (savedCharIndex / totalChars) * 100 : 0,
            duration: estimatedDuration,
        }));

    }, [state.currentChapter, state.playbackRate, stopPlayback]);

    const togglePlayPause = useCallback(() => {
        if (!utteranceRef.current) return;
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            setState(prev => ({ ...prev, isPlaying: true }));
        } else if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            setState(prev => ({ ...prev, isPlaying: false }));
        }
    }, []);

    const seek = useCallback((percentage: number) => {
        if (!state.currentChapter || !originalTextRef.current) return;
        
        const charIndex = Math.floor((percentage / 100) * originalTextRef.current.length);
        setPlaybackPosition(state.currentChapter.id, charIndex);
        
        // Re-play from the new position by stopping and starting again
        // Directly changing text of a speaking utterance is not reliable
        stopPlayback();
        setTimeout(() => playChapter(state.currentChapter!), 50);

    }, [state.currentChapter, playChapter, stopPlayback]);

    const setPlaybackRate = useCallback((rate: number) => {
        setState(prev => ({...prev, playbackRate: rate}));
        if (utteranceRef.current && speechSynthesis.speaking) {
            // To change rate, we must restart
            const progressPercentage = state.progress;
            stopPlayback();
             setTimeout(() => {
                if(state.currentChapter) {
                    const charIndex = Math.floor((progressPercentage / 100) * originalTextRef.current.length);
                    setPlaybackPosition(state.currentChapter.id, charIndex);
                    playChapter(state.currentChapter);
                }
             }, 50);
        }
    }, [playChapter, stopPlayback, state.progress, state.currentChapter]);
    
    const closePlayer = useCallback(() => {
        stopPlayback();
    }, [stopPlayback]);

    // Make sure voices are loaded
    useEffect(() => {
        const loadVoices = () => speechSynthesis.getVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        return () => { speechSynthesis.onvoiceschanged = null; };
    }, []);

    const contextValue = { ...state, playChapter, togglePlayPause, seek, setPlaybackRate, closePlayer };

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
};
