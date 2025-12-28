
export const calculateReadingTime = (htmlContent: string): string => {
    if (!htmlContent) return '۱ دقیقه مطالعه';
    
    // 1. Remove HTML tags
    const text = htmlContent.replace(/<[^>]*>/g, ' ');
    
    // 2. Split by whitespace and count words
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    
    // 3. Calculate reading time (assuming 200 WPM)
    const WPM = 200;
    const minutes = Math.ceil(wordCount / WPM);
    
    // 4. Format the output string
    if (minutes < 1) {
        return '۱ دقیقه مطالعه';
    }
    
    return `${new Intl.NumberFormat('fa-IR').format(minutes)} دقیقه مطالعه`;
};
