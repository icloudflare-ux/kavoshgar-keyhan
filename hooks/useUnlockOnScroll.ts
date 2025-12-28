
import React, { useEffect, useRef, useContext } from 'react';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';
import { ChapterId } from '../data/cosmicLibraryData';

const useUnlockOnScroll = (
    ref: React.RefObject<HTMLElement>,
    chapterId: ChapterId
) => {
    const libraryContext = useContext(CosmicLibraryContext);
    const hasBeenUnlocked = useRef(false);
    
    useEffect(() => {
        // Prevent re-triggering if already unlocked in this session or from storage
        if (libraryContext?.unlockedChapters.has(chapterId)) {
            hasBeenUnlocked.current = true;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasBeenUnlocked.current) {
                    libraryContext?.unlockChapter(chapterId);
                    hasBeenUnlocked.current = true;
                    observer.disconnect(); // Disconnect after unlocking
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5, // Trigger when 50% of the element is visible
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, chapterId, libraryContext]);
};

export default useUnlockOnScroll;
