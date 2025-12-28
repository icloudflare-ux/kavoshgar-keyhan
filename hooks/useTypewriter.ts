

import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50, onComplete?: () => void) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on new text
        if (text) {
            let i = 0;
            const intervalId = setInterval(() => {
                // Use substring for better performance with long texts
                setDisplayedText(text.substring(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(intervalId);
                    if (onComplete) {
                        onComplete();
                    }
                }
            }, speed);

            return () => clearInterval(intervalId);
        }
    }, [text, speed, onComplete]);

    return displayedText;
};