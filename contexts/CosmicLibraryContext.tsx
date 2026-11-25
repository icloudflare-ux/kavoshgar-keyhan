
import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';

interface CosmicLibraryContextType {
    unlockedChapters: Set<string>;
    unlockChapter: (id: string) => void;
}

const LIBRARY_STORAGE_KEY = 'cosmic_library_unlocked_chapters';
const DEFAULT_UNLOCKED_CHAPTERS = ['intro', 'babylonians'];

export const CosmicLibraryContext = createContext<CosmicLibraryContextType | undefined>(undefined);

export const CosmicLibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [unlockedChapters, setUnlockedChapters] = useState<Set<string>>(() => {
        try {
            const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
            if (stored) {
                const storedSet = new Set(JSON.parse(stored) as string[]);
                // Ensure defaults are always present
                DEFAULT_UNLOCKED_CHAPTERS.forEach(id => storedSet.add(id));
                return storedSet;
            }
        } catch (error) {
            console.error("Failed to load unlocked chapters from localStorage", error);
        }
        return new Set(DEFAULT_UNLOCKED_CHAPTERS);
    });

    const unlockChapter = useCallback((id: string) => {
        setUnlockedChapters(prev => {
            if (prev.has(id)) {
                return prev; // No change needed
            }
            const newSet = new Set(prev);
            newSet.add(id);
            try {
                localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(Array.from(newSet)));
            } catch (error) {
                console.error("Failed to save unlocked chapters to localStorage", error);
            }
            return newSet;
        });
    }, []);

    const contextValue = useMemo(() => ({
        unlockedChapters,
        unlockChapter
    }), [unlockedChapters, unlockChapter]);
    
    return (
        <CosmicLibraryContext.Provider value={contextValue}>
            {children}
        </CosmicLibraryContext.Provider>
    );
};
