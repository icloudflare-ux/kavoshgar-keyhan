import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Profile, BirthChartData, FamousPerson, NatalChartData, Aspect, PlanetPosition, Transit, EphemerisData, EsotericRulers, CleansingRitual, TradingDayAnalysis } from "../types";

const model = 'gemini-3-flash-preview';
const GEMINI_API_KEY = 'AIzaSyCt918m61hEJ7XsK3DBi4dcu3iARBdplMk';

// Singleton AI instance
let ai: GoogleGenAI | null = null;

const CONFIGURATION_ERROR_MESSAGE = "خطای پیکربندی: کلید API در محیط برنامه تنظیم نشده است. لطفاً با مدیر سیستم تماس بگیرید.";

// A collection of pre-defined, uplifting messages to use when the API fails or is rate-limited.
const fallbackAdvices = [
    "امروز فرصتی است برای درخشش شما. از آن نهایت استفاده را ببرید.",
    "به ندای قلب خود گوش فرا دهید و مسیرتان را با اطمینان ادامه دهید.",
    "انرژی امروز برای برداشتن یک قدم کوچک اما مهم، عالی است.",
    "با تمرکز بر لحظه حال، آرامش را به خود هدیه دهید.",
    "یک عمل نیک کوچک، می‌تواند بازتابی بزرگ در کائنات داشته باشد."
];

const getAi = (): GoogleGenAI | null => {
    if (ai) return ai;
    const apiKey = GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Gemini API Key is not set.");
        return null;
    }
    ai = new GoogleGenAI({ apiKey });
    return ai;
};

// PRIVATE HELPER for retry logic with exponential backoff
const _generateContentWithRetry = async (
    params: { model: string; contents: any; config?: any },
    retries = 3,
    delay = 2000 // Start with a 2-second delay
): Promise<GenerateContentResponse> => {
    const aiInstance = getAi();
    if (!aiInstance) {
        throw new Error(CONFIGURATION_ERROR_MESSAGE);
    }
    try {
        const response = await aiInstance.models.generateContent(params);
        return response;
    } catch (error: any) {
        // Check for specific retryable error codes from Google API or general network issues
        const isRetryable = error.message.includes('429') || error.message.includes('503') || error.message.includes('500');
        
        if (retries > 0 && isRetryable) {
            console.warn(`API call failed with retryable error. Retrying in ${delay / 1000}s... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay + Math.random() * 1000)); // Add jitter
            return _generateContentWithRetry(params, retries - 1, delay * 2); // Exponential backoff
        } else {
            console.error("API call failed after all retries or with a non-retryable error:", error.message);
            throw error;
        }
    }
};

const _parseGeminiJsonResponse = (response: GenerateContentResponse): any | null => {
    const jsonText = response.text;
    if (!jsonText) {
        console.error("No content received from Gemini API for JSON parsing.");
        return null;
    }
    try {
        const cleanJsonText = jsonText.trim().replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanJsonText);
    } catch (error: any) {
        console.error("Failed to parse JSON from Gemini response:", error.message, "Raw text:", jsonText);
        return null;
    }
};

export const generateWelcomeMessage = async (userName: string, ascendantSign: string): Promise<string> => {
    const prompt = `
        **Role:** You are a wise and welcoming astrologer.
        **Task:** Write a very short (one sentence, max 15 words) personalized and uplifting welcome message for a user.
        **User Info:**
        - Name: ${userName}
        - Ascendant Sign: ${ascendantSign}

        **Instructions:**
        - Address the user by their name, "${userName}".
        - The message should be positive and encouraging.
        - Subtly hint at an astrological theme related to their ascendant sign (${ascendantSign}) or a positive transit of the day without getting technical. For example, "امروز ماه با طالع شما در زاویه خوبی است" or "انرژی امروز برای خلاقیت شما مناسب است".
        - **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.9 } });
        return response.text || `خوش آمدی ${userName}! روزی پر از انرژی برایت آرزومندم.`;
    } catch (error: any) {
        console.error("Error generating welcome message:", error.message);
        return `خوش آمدی ${userName}!`;
    }
};


export const generateAstrologicalReading = async (
    name: string,
    motherName: string,
    rabTale: number,
    birthDate?: string,
    birthTime?: string
): Promise<string> => {
    if (!name || !motherName) return "لطفاً نام و نام مادر را وارد کنید.";

    const birthInfo = birthDate ? `متولد "${birthDate}" ${birthTime ? `حدود ساعت ${birthTime}` : ''}` : '';

    const prompt = `
        **نقش:** تو یک حکیم علوم غریبه و استاد علم حروف (حکیم‌الغیب) هستی.
        **وظیفه:** یک تحلیل طالع ابجدی عمیق و عرفانی برای شخصی به نام «${name}» فرزند «${motherName}» ${birthInfo} بنویس.
        **داده کلیدی:** عدد رب‌الطالع این شخص بر اساس حساب ابجد کبیر، ${rabTale} است. بر اساس این عدد، برج طالع او به شرح زیر است:
        ۱: حمل (آتش)، ۲: ثور (خاک)، ۳: جوزا (هوا)، ۴: سرطان (آب)، ۵: اسد (آتش)، ۶: سنبله (خاک)، ۷: میزان (هوا)، ۸: عقرب (آب)، ۹: قوس (آتش)، ۱۰: جدی (خاک)، ۱۱: دلو (هوا)، ۱۲: حوت (آب).

        **دستورالعمل‌های ساختاری:**
        1.  **لحن:** بسیار سنگین، عرفانی، ادبی و اسرارآمیز. از زبان استعاری و نمادین استفاده کن. از لحن مستقیم و علمی پرهیز کن.
        2.  **قالب:** پاسخ باید حداقل شامل ۳ پاراگراف مجزا باشد. از مارکرهای @@EPIC@@ یا @@FINAL@@ استفاده نکن.
        3.  **محتوا:** تحلیل باید به ترتیب شامل موارد زیر باشد:
            - **پاراگراف اول (ویژگی‌های شخصیتی):** ذات و سرشت درونی فرد را بر اساس برج طالع ابجدی او توصیف کن. به نقاط قوت و ضعف پنهان او اشاره کن.
            - **پاراگراف دوم (عنصر وجودی):** توضیح بده که چگونه عنصر وجودی (آتش، خاک، هوا، آب) مرتبط با طالع او، بر انگیزه‌ها، احساسات و نحوه تعاملش با جهان تأثیر می‌گذارد.
            - **پاراگراف سوم (پیش‌بینی کلی):** یک پیش‌بینی کلی یا پند حکیمانه برای مسیر زندگی و سرنوشت او ارائه بده. این بخش باید کلی و الهام‌بخش باشد، نه یک پیشگویی قطعی.
        4.  **تأکید:** کلمات کلیدی عرفانی (مانند نام برج‌ها، سیارات، عناصر، مفاهیم باطنی) را با **دو ستاره** در دو طرفشان برجسته کن. مثال: **شجاعت** یا **کوکب مریخ**.
        
        **دستورالعمل حیاتی: تمام پاسخ تو باید به زبان فارسی باشد.**
        `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.75 } });
        return response.text || "تحلیل دریافت نشد.";
    } catch (error: any) {
        console.error("Error generating astrological reading:", error.message);
        return "خطا در تولید تحلیل طالع. لطفاً بعداً دوباره امتحان کنید.";
    }
};

export const generateScientificReport = async (celestialBody: string): Promise<string> => {
    const prompt = `
        Provide a brief and accurate scientific report about the celestial body "${celestialBody}".
        This report should include information about its astronomical position (constellation), observation conditions from Earth, and an interesting, lesser-known fact about it.
        **Formatting instruction:** Emphasize key scientific words and phrases (like proper names, important numbers, physical concepts) by placing them between double asterisks. Example: **Crab Nebula** or **6,500 light-years**.
        
        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
        `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt });
        return response.text || "Report not received.";
    } catch (error: any) {
        console.error("Error generating scientific report:", error.message);
        return "خطا در تولید گزارش علمی.";
    }
};

const zodiacDetailSchema = {
    type: Type.OBJECT,
    properties: {
        generalAnalysis: { type: Type.STRING },
        strengths: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ['title', 'description'],
            },
        },
        weaknesses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ['title', 'description'],
            },
        },
        career: { type: Type.STRING },
        relationships: { type: Type.STRING },
        recommendations: {
            type: Type.OBJECT,
            properties: {
                men: { type: Type.STRING },
                women: { type: Type.STRING },
            },
            required: ['men', 'women'],
        },
    },
    required: ['generalAnalysis', 'strengths', 'weaknesses', 'career', 'relationships', 'recommendations'],
};

export const generateZodiacSignDetails = async (sign: { traditional: string; modern: string; planet: string; element: string; }): Promise<any> => {
    const prompt = `
        Provide a complete and detailed personality analysis for the zodiac sign ${sign.modern} (traditional: ${sign.traditional}), whose ruling planet is ${sign.planet} and element is ${sign.element}.
        The analysis should include: general personality analysis, key strengths, weaknesses and challenges, career and profession, emotional and social relationships, and separate recommendations for men and women of this sign.
        The tone should be engaging, fluent, and somewhat poetic, suitable for astrological topics.

        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
        The output must be a JSON object adhering to the provided schema.
    `;
    
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: zodiacDetailSchema }});
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating zodiac details:", error.message);
        return null;
    }
};

const qarinNameSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The generated Qarin name with full Arabic diacritics.' },
        explanation: { type: Type.STRING, description: 'A short explanation of how the name was constructed.' },
    },
    required: ['name', 'explanation'],
};

export const generateQarinName = async (letters: string[]): Promise<{ name: string; explanation: string; }> => {
    const prompt = `
        Using the "definitive method for Qarin name", create a special name for the Qarin from the three extracted letters [${letters.join(', ')}], which are the initial, middle, and final letters respectively.

        **CRITICAL RULES:**
        1.  **Consistency:** If these same three letters are sent again, you MUST generate the *exact* same name. Changing the name is forbidden.
        2.  **Full Diacritics (Tashkeel):** The output name **MUST** have complete Arabic diacritics (fatha, kasra, damma, sukun). Example: instead of "ناهز", write "نَاهِزْ" or "نُهَزْ".
        3.  **Structure:** The letters [${letters.join(', ')}] are the core letters. To make it pronounceable, you can add vowels (ا, و, ی), but the core structure must be preserved.
        
        **Output:**
        -   **name:** The final name in Arabic script with full diacritics.
        -   **explanation:** A short explanation of how the name was constructed.
        
        **LANGUAGE INSTRUCTION: The 'explanation' field must be in the Persian language. The 'name' field must remain in its original Arabic script with diacritics.**
        `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: qarinNameSchema, temperature: 0.0 }});
        const parsed = _parseGeminiJsonResponse(response);
        if (!parsed) {
            throw new Error('qarin_error_parsing');
        }
        return parsed;
    } catch (error: any) {
        console.error("Error generating Qarin name:", error.message);
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                throw new Error('qarin_error_api_key');
            }
            if (error.message.includes('timed out') || error.message.includes('deadline')) {
                throw new Error('qarin_error_timeout');
            }
            if (error.message.startsWith('qarin_error_')) {
                throw error;
            }
        }
        throw new Error('qarin_error_ai_generic');
    }
};

const nadiReadingSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        archetype: { type: Type.STRING },
        coreEssence: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
        awakeningMantra: { type: Type.STRING },
        practicalRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['title', 'archetype', 'coreEssence', 'strengths', 'challenges', 'awakeningMantra', 'practicalRecommendations'],
};

export const generateNadiReading = async (letter: string, element: string, elementName: string): Promise<any> => {
    const prompt = `
        Based on the science of Nadi astrology and the four elements, provide a complete, deep, and personalized analysis for an individual whose Qarin's first letter is "${letter}" and who belongs to the "${elementName}" Nadi with the element "${element}".
        The tone should be wise, inspiring, and empowering. The analysis must be structured according to the provided schema.

        **Content Guidelines:**
        -   **Personalization:** In the "coreEssence" section, clearly refer to the letter "${letter}" as the key and gateway to this Nadi.
        -   **Depth:** The analysis should go beyond clichés and delve into the spiritual and psychological aspects of this element.
        -   **Practicality:** Recommendations should be practical and applicable in daily life.
        
        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
        The output must be a JSON object adhering to the provided schema.
        `;
    
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: nadiReadingSchema, temperature: 0.7 }});
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating Nadi reading:", error.message);
        return null;
    }
};

const natalChartSchema = {
    type: Type.OBJECT,
    properties: {
        planets: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    planet: { type: Type.STRING, description: "The planet name: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, or Ascendant." },
                    sign: { type: Type.STRING, description: "The English zodiac sign name." },
                    degree: { type: Type.NUMBER, description: "The degree within the sign (0-29)." },
                },
                required: ['planet', 'sign', 'degree'],
            }
        },
        houses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    house: { type: Type.INTEGER, description: "The house number (1-12)." },
                    sign: { type: Type.STRING, description: "The English zodiac sign name." },
                    degree: { type: Type.NUMBER, description: "The degree of the cusp within the sign (0-29)." },
                },
                required: ['house', 'sign', 'degree'],
            }
        }
    },
    required: ['planets', 'houses'],
};

export const generateNatalChartData = async (birthDate: string, birthTime: string, birthCity: string): Promise<NatalChartData | null> => {
    const prompt = `
        As an expert astrologer using the Placidus house system, calculate the precise natal chart data for a birth with the following details:
        - Birth Date: ${birthDate}
        - Birth Time: ${birthTime}
        - Birth Location: ${birthCity}

        Return the result as a JSON object that strictly adheres to the provided schema.
        The names of the zodiac signs MUST be in English and chosen from this exact list:
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces".

        Provide positions (sign and degree) for: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn.
        The Ascendant is the cusp of the 1st house. Include it in the 'planets' array as 'Ascendant' AND as house 1 in the 'houses' array.
        Also, provide the cusps (sign and degree) for all 12 houses.
        `;
        
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: natalChartSchema }});
        return _parseGeminiJsonResponse(response) as NatalChartData | null;
    } catch (error: any) {
        console.error("Error generating natal chart data:", error.message);
        return null;
    }
};

const planetPositionsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            planet: { type: Type.STRING, description: "The planet name: Sun, Moon, Mercury, Venus, Mars, Jupiter, or Saturn." },
            sign: { type: Type.STRING, description: "The English zodiac sign name." },
            degree: { type: Type.NUMBER, description: "The degree within the sign (0-29)." },
        },
        required: ['planet', 'sign', 'degree'],
    }
};

export const getCurrentPlanetPositions = async (): Promise<PlanetPosition[] | null> => {
    const today = new Date().toISOString().split('T')[0];

    const prompt = `
        As an expert astrologer, calculate the current precise astronomical positions for today, ${today}.
        Provide the positions (sign and degree) for: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn.
        
        Return the result as a JSON array of objects that strictly adheres to the provided schema.
        The names of the zodiac signs MUST be in English and chosen from this exact list:
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces".
    `;

    try {
        const response = await _generateContentWithRetry({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: planetPositionsSchema,
            }
        });
        return _parseGeminiJsonResponse(response) as PlanetPosition[] | null;
    } catch (error: any) {
        console.error("Error generating current planet positions:", error.message);
        return null;
    }
};

export const interpretTransit = async (transit: Transit): Promise<string> => {
    const { transitingPlanet, natalPoint, type } = transit;

    const planetTranslations: { [key: string]: string } = {
        Sun: 'خورشید', Moon: 'ماه', Mercury: 'عطارد', Venus: 'زهره', Mars: 'مریخ', Jupiter: 'مشتری', Saturn: 'زحل', Ascendant: 'طالع', Midheaven: 'وسط آسمان'
    };
    
    const aspectTranslations: { [key: string]: string } = {
        conjunction: 'قران', sextile: 'تسدیس', square: 'تربیع', trine: 'تثلیث', opposition: 'مقابله'
    };

    const transitingPlanetName = planetTranslations[transitingPlanet.planet] || transitingPlanet.planet;
    const natalPointName = planetTranslations[natalPoint.planet] || natalPoint.planet;
    const aspectName = aspectTranslations[type] || type;

    const prompt = `
        As an expert astrologer, provide a brief, one-sentence, and practical interpretation for the following transit:
        "The transit of **${transitingPlanet.planet}** forming a **${type}** with the natal **${natalPoint.planet}**."

        **Context:**
        - Transiting Planet: ${transitingPlanetName}
        - Natal Point: ${natalPointName}
        - Aspect: ${aspectName}

        **Instructions:**
        - The interpretation should be a piece of advice or an insight for the person experiencing it.
        - Focus on the psychological and practical effects.
        - The tone should be wise and guiding.
        - **CRITICAL INSTRUCTION: Your entire response must be in the Persian language and should be a single sentence.**
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.7 } });
        return response.text || "تفسیر دریافت نشد.";
    } catch (error: any) {
        console.error("Error interpreting transit:", error.message);
        return "خطا در دریافت تفسیر ترانزیت.";
    }
};

const ephemerisSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            planet: { type: Type.STRING, description: "The planet name: Sun, Moon, Mercury, Venus, Mars, Jupiter, or Saturn." },
            sign: { type: Type.STRING, description: "The English zodiac sign name." },
            degree: { type: Type.INTEGER, description: "The degree within the sign (0-29)." },
            minute: { type: Type.INTEGER, description: "The minute within the degree (0-59)." },
            motion: { type: Type.STRING, description: "The planet's motion: 'Direct' or 'Retrograde'." },
            speed: { type: Type.NUMBER, description: "The planet's speed in degrees per day." },
        },
        required: ['planet', 'sign', 'degree', 'minute', 'motion', 'speed'],
    }
};

export const getRealTimeEphemeris = async (): Promise<EphemerisData[] | null> => {
    const prompt = `
        As an expert astrologer, calculate the current precise astronomical ephemeris for this exact moment.
        Provide the data for the following planets: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn.
        For each planet, provide:
        - The zodiac sign it is in (in English).
        - The degree (0-29).
        - The minute (0-59).
        - The motion ('Direct' or 'Retrograde').
        - The speed in degrees per day.

        Return the result as a JSON array of objects that strictly adheres to the provided schema.
        The names of the zodiac signs MUST be in English and chosen from this exact list:
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces".
    `;

    try {
        const response = await _generateContentWithRetry({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ephemerisSchema,
            }
        });
        return _parseGeminiJsonResponse(response) as EphemerisData[] | null;
    } catch (error: any) {
        console.error("Error generating real-time ephemeris:", error.message);
        return null;
    }
};

const formatAspectsForPrompt = (aspects: Aspect[]): string => {
    if (!aspects || aspects.length === 0) return "هیچ زاویه مهمی یافت نشد.";

    const aspectTranslations: { [key: string]: string } = {
        conjunction: 'قران', sextile: 'تسدیس', square: 'تربیع', trine: 'تثلیث', opposition: 'مقابله'
    };
    const planetTranslations: { [key: string]: string } = {
        Sun: 'خورشید', Moon: 'ماه', Mercury: 'عطارد', Venus: 'زهره', Mars: 'مریخ', Jupiter: 'مشتری', Saturn: 'زحل', Ascendant: 'طالع'
    };
    
    const hardAspects = aspects.filter(a => a.type === 'square' || a.type === 'opposition');
    const softAspects = aspects.filter(a => a.type === 'trine' || a.type === 'sextile');
    
    let promptText = "";

    if (hardAspects.length > 0) {
        promptText += "زوایای سخت (چالش‌ها):\n" + hardAspects.map(a => 
            `- **${aspectTranslations[a.type]}** بین **${planetTranslations[a.planet1.planet]}** (در برج ${a.planet1.sign}) و **${planetTranslations[a.planet2.planet]}** (در برج ${a.planet2.sign})`
        ).join('\n') + "\n";
    }

    if (softAspects.length > 0) {
        promptText += "زوایای نرم (قوت‌ها):\n" + softAspects.map(a => 
            `- **${aspectTranslations[a.type]}** بین **${planetTranslations[a.planet1.planet]}** (در برج ${a.planet1.sign}) و **${planetTranslations[a.planet2.planet]}** (در برج ${a.planet2.sign})`
        ).join('\n') + "\n";
    }

    if (promptText === "") return "هیچ زاویه سخت یا نرم مهمی یافت نشد. به طور کلی تحلیل کن.";

    return promptText;
};


export const generateHoroscopeAnalysis = async (
    name: string,
    birthDate: string, 
    birthTime: string, 
    birthCity: string,
    aspects: Aspect[]
): Promise<string> => {
    const aspectsText = formatAspectsForPrompt(aspects);

    const prompt = `
        **نقش:** تو یک حکیم و منجم بزرگ هستی با لحنی اسرارآمیز، عمیق و ادبی.
        **وظیفه:** یک تحلیل زایچه کامل و شخصی‌سازی شده برای «${name}» بنویس.
        **اطلاعات زمینه:** تاریخ تولد ${birthDate}، ساعت ${birthTime} در شهر ${birthCity}. این اطلاعات برای زمینه کلی است، تحلیل اصلی باید بر اساس داده‌های زیر باشد.

        **دستورالعمل‌های ساختاری:**
        1.  **شخصی‌سازی:** در متن تحلیل، حتماً نام «${name}» را به کار ببر تا حس اختصاصی بودن تقویت شود.
        2.  **لحن:** حکیمانه، اسرارآمیز، مثبت و الهام‌بخش.
        3.  **قالب:** پاسخ باید شامل ۳ پاراگراف اصلی و مجزا باشد. از مارکرهای خاص مثل @@EPIC@@ استفاده نکن.
        4.  **برجسته‌سازی:** کلمات کلیدی (نام سیارات، برج‌ها، زوایا) را با **دو ستاره** برجسته کن.
        
        **محتوای تحلیل (به ترتیب):**
        
        **پاراگراف اول: هسته شخصیتی**
        - این بخش را بر اساس تعامل **خورشید** و **ماه** در زایچه تحلیل کن. این بخش باید جوهر وجودی، اراده (خورشید) و دنیای درونی/احساسی (ماه) «${name}» را توصیف کند. اگر زاویه مستقیمی بین خورشید و ماه در داده‌ها نیست، به طور کلی بر اساس برج‌های تخمینی آن‌ها تحلیل کن.

        **پاراگراف دوم: چالش‌های کارمایی و نقاط رشد**
        - این بخش را فقط بر اساس **زوایای سخت** (تربیع و مقابله) که در زیر آمده، تحلیل کن. توضیح بده این زوایا چه درس‌ها، موانع یا تنش‌های درونی را در مسیر زندگی «${name}» قرار می‌دهند و چگونه می‌تواند از آن‌ها برای رشد استفاده کند.
        
        **پاراگراف سوم: نقاط قوت پنهان و استعدادها**
        - این بخش را فقط بر اساس **زوایای نرم** (تثلیث و تسدیس) که در زیر آمده، تحلیل کن. توضیح بده این زوایا چه استعدادها، فرصت‌ها و جریان‌های انرژی روانی را برای «${name}» فراهم می‌کنند.
        
        **داده‌های کلیدی برای تحلیل:**
        ${aspectsText}
        
        **دستورالعمل حیاتی: تمام پاسخ تو باید به زبان فارسی باشد.**
        `;
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt });
        return response.text || "Analysis not received.";
    } catch (error: any) {
        console.error("Error generating horoscope analysis:", error.message);
        return "خطا در تولید تحلیل زایچه.";
    }
};

export const generateElectionalAnalysis = async (eventType: string, dateRange: string): Promise<string> => {
    const prompt = `
        As an expert in Electional Astrology, identify the best and most auspicious times to perform **"${eventType}"** within the time frame of **"${dateRange}"**.

        **Instructions:**
        1.  **Tone:** Precise, scientific, and guiding.
        2.  **Bolding:** Emphasize dates, planet names, and key concepts with **double asterisks**.
        3.  **Analysis Structure:**
            -   **Introduction:** A brief explanation of the importance of choosing the right time for "${eventType}".
            -   **Auspicious Times:** List a few specific dates and times as the best options. For each, briefly state the astrological reason (e.g., **Good Moon position**, **Auspicious Jupiter-Venus aspect**, **Free from malefic aspects**).
            -   **Inauspicious Times:** Mention times to avoid and briefly explain why (e.g., **Void of Course Moon**, **Malefic Mars-Saturn aspect**).
            -   **Final Recommendation:** Provide a general recommendation for taking action during the suggested times.
        
        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
        `;
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt });
        return response.text || "Analysis not received.";
    } catch (error: any) {
        console.error("Error generating electional analysis:", error.message);
        return "خطا در یافتن بهترین زمان.";
    }
};

export const generateHoraryAnswer = async (question: string, timestamp: Date, location: { latitude: number, longitude: number } | null): Promise<string> => {
    const timeInfo = `at ${timestamp.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}`;
    const locationInfo = location ? `at geo-location (${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)})` : 'at an unspecified location';

    const prompt = `
        As an expert Horary Astrologer, answer the following question. The question was asked ${timeInfo} ${locationInfo}.

        **Question:** "${question}"

        **Instructions:**
        1.  **Tone:** Decisive and wise, but avoid definitive "yes" or "no" answers that could be misleading. Instead, explain the conditions and probabilities.
        2.  **Bolding:** Emphasize key concepts (e.g., **First House**, **Ruling Planet**, **Aspects**) with **double asterisks**.
        3.  **Answer Structure:**
            -   **Initial Analysis:** Based on the time and location, identify the **Ascendant of the question** and its ruling planet. This planet represents the querent.
            -   **Question's Subject Analysis:** Identify the house related to the question's subject (e.g., 7th house for marriage, 10th for career) and its ruling planet.
            -   **Aspect Analysis:** The most crucial part. Analyze the aspect between the querent's ruling planet and the subject's ruling planet. Do they have an auspicious aspect (like trine or sextile) or an inauspicious one (like opposition or square)? Will they form an aspect soon?
            -   **Conclusion:** Based on the analysis, provide a logical conclusion. Explain whether the conditions for the matter to succeed are **easy** and **smooth** or will be met with **obstacles** and **difficulties**.
        
        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
        `;
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt });
        return response.text || "Answer not received.";
    } catch (error: any) {
        console.error("Error generating horary answer:", error.message);
        return "خطا در دریافت پاسخ.";
    }
};

export const generatePersonalDignityAnalysis = async (sign: string, ruler: string): Promise<string> => {
    const prompt = `
        As a master astrologer, write a deep personal analysis for an individual whose ascendant sign (by Rab al-Taleh method) is **${sign}** and whose ruling planet is **${ruler}**.

        **Structural Instructions:**
        1.  **Tone:** Wise, empowering, and guiding.
        2.  **Bolding:** Emphasize keywords (planet names, signs, concepts) with **double asterisks**.
        3.  **Analysis Structure:**
            -   **Introduction:** Start by introducing **${ruler}** as the ruling planet of this individual's destiny and explain its core nature.
            -   **Peak Strength (Rulership & Exaltation):** Explain in which signs the planet **${ruler}** is at its peak power (Rulership or Exaltation). Describe how this power manifests in the individual's personality and talents, and how they can use this potential.
            -   **Challenge Points (Detriment & Fall):** Explain in which signs the planet **${ruler}** is weak (Detriment or Fall). Describe what challenges or blind spots these weaknesses create in the individual's life.
            -   **Practical Guide:** Based on the ruling planet's strengths and weaknesses, provide a few practical and personalized recommendations for personal growth. (e.g., how to use Mars's power for leadership and avoid its aggression).
        4.  **Special Ending:** End with two separate final paragraphs: an epic summary starting with @@EPIC@@, and a final piece of advice starting with @@FINAL@@.
        
        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
        `;
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt });
        return response.text || "Analysis not received.";
    } catch (error: any) {
        console.error("Error generating personal dignity analysis:", error.message);
        return "خطا در تولید تحلیل شخصی.";
    }
};

export const generateDreamInterpretation = async (dream: string): Promise<string> => {
    const prompt = `
        As a wise and empathetic dream interpreter named 'Hakim Roya' (The Dream Sage), interpret the following dream.
        Your interpretation must be deep, multi-faceted, and inspired by the following sources:
        1. Traditional symbology (like Ibn Sirin).
        2. Jungian psychology (for analyzing archetypes, the shadow, and individuation).
        3. Modern psychological perspectives (linking the dream to stresses and desires).
        4. Islamic mysticism and wisdom (inspired by narrations).
        5. Abrahamic religious symbology (inspired by stories of prophets in holy books).

        **Response Structure:**
        1. **Main Symbols:** Identify 2-3 important symbols in the dream and make them bold using **double asterisks**.
        2. **Thematic Analysis:** Describe the main story or feeling of the dream.
        3. **Multi-layered Interpretation:** Write several paragraphs explaining the possible meanings from different viewpoints.
        4. **Guiding Questions:** At the end, pose 2-3 introspective questions for the dreamer to reflect upon.
        5. **Tone:** Your tone should be calming, non-judgmental, and empowering. Avoid definitive predictions.
        6. **Conclusion:** End the text with a final paragraph as a concluding piece of advice, starting with the marker @@FINAL@@.

        The dream is:
        "${dream}"

        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt });
        return response.text || "Interpretation not received.";
    } catch (error: any) {
        console.error("Error generating dream interpretation:", error.message);
        return "خطا در تعبیر خواب. لطفاً بعداً دوباره امتحان کنید.";
    }
};

export const generateDailyAdvice = async (sign: string): Promise<string> => {
    const prompt = `
        For a person whose ascendant sign is **${sign}**, write a short (max two sentences), wise, and inspiring daily advice.
        This advice should consider today's energy and help them on their path of personal growth.
        The tone should be positive and empowering.
        
        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
    `;
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.9 }});
        const adviceText = response.text;
        
        if (adviceText && adviceText.trim().length > 10) {
            return adviceText;
        }
        
        console.warn("Received an empty or short response from Gemini for daily advice.");
        const randomIndex = Math.floor(Math.random() * fallbackAdvices.length);
        return fallbackAdvices[randomIndex];

    } catch (error: any) {
        console.error("Error generating daily advice:", error.message);
        const randomIndex = Math.floor(Math.random() * fallbackAdvices.length);
        return fallbackAdvices[randomIndex];
    }
};

const relationshipAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        elementalHarmony: { type: Type.STRING },
        planetaryDynamics: { type: Type.STRING },
        numerologicalConnection: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
        conclusion: { type: Type.STRING },
    },
    required: ['elementalHarmony', 'planetaryDynamics', 'numerologicalConnection', 'strengths', 'challenges', 'conclusion'],
};

export const generateRelationshipAnalysis = async (
    profile1: Profile,
    analysis1: { sign: string; ruler: string; element: string; number: number; },
    profile2: Profile,
    analysis2: { sign: string; ruler: string; element: string; number: number; },
    relationshipType: string
): Promise<any | null> => {
    const prompt = `
        As an expert astrologer in relationship analysis, provide a comprehensive and deep analysis for the relationship between the following two individuals. Their relationship type is "${relationshipType}".

        **Person 1: ${profile1.name} child of ${profile1.motherName}**
        - Ascendant Sign: ${analysis1.sign}
        - Ruling Planet: ${analysis1.ruler}
        - Element: ${analysis1.element}
        - Name Numerology Number: ${analysis1.number}

        **Person 2: ${profile2.name} child of ${profile2.motherName}**
        - Ascendant Sign: ${analysis2.sign}
        - Ruling Planet: ${analysis2.ruler}
        - Element: ${analysis2.element}
        - Name Numerology Number: ${analysis2.number}

        **Analysis Instructions:**
        1.  **Elemental Harmony:** Analyze the compatibility of the four elements (Fire, Earth, Air, Water) of the two individuals.
        2.  **Planetary Dynamics:** Examine the interaction between their ruling planets (${analysis1.ruler} and ${analysis2.ruler}).
        3.  **Numerological Connection:** Analyze the connection between their name numerology numbers (${analysis1.number} and ${analysis2.number}).
        4.  **Strengths & Challenges:** Based on the above analyses, list key strengths and major challenges in this relationship.
        5.  **Conclusion:** Provide a final conclusion and constructive advice for the success of this relationship.

        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language, formatted as a JSON object adhering to the provided schema.**
        `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: relationshipAnalysisSchema, temperature: 0.5 }});
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating relationship analysis:", error.message);
        return null;
    }
};

const jafarSchema = {
    type: Type.OBJECT,
    properties: {
        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        finalAnswer: { type: Type.STRING },
    },
    required: ['steps', 'finalAnswer'],
};

export const generateJafarAnswer = async (question: string): Promise<{ steps: string[], finalAnswer: string } | null> => {
    const prompt = `
        As a grandmaster of the science of Jafr, analyze the following question using the "Mustahsala" method and extract its answer.
        
        **Question:** "${question}"

        **Instructions:**
        1.  **Simulate the Process:** Briefly simulate the main stages of the Mustahsala process. This should include letter extraction, the "Asas" stage, and the "Nazira" stage. No need for full tables, just a short description of each step and its result.
        2.  **Extract the Answer:** Based on these steps, formulate a final answer (the Mustahsala).
        3.  **Tone of Final Answer:** The final answer should be short, wise, slightly poetic, and relevant to the question.
        
        **CRITICAL INSTRUCTION: The entire JSON output, including 'steps' and 'finalAnswer', must be in the Persian language.**
        `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: jafarSchema, temperature: 0.6 }});
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating Jafar answer:", error.message);
        return null;
    }
};

export const generateRabAlTalehAnalysis = async (
    name: string,
    motherName: string,
    rabTale: number,
    sign: string,
    element: string
): Promise<string> => {
    const prompt = `
        As a wise mystic and master of esoteric sciences, write a literary and mysterious analysis, approximately 300 words long, for a person named **${name}**, child of **${motherName}**.

        **Core Information:**
        - Their Abjad Ascendant (Rab al-Taleh), derived from their name, corresponds to the number **${rabTale}**, which is the sign of **${sign}**.
        - The ruling element of this sign is **${element}**.

        **Structural Instructions:**
        1.  **Tone:** Deeply mysterious, poetic, and literary. Use allegories and esoteric language. Avoid a direct, clinical tone. Do not use markers like @@EPIC@@.
        2.  **Length:** The total analysis should be around 300 words.
        3.  **Content Focus:**
            -   Begin by introducing the Ascendant sign **${sign}** as a cosmic gateway.
            -   Deeply analyze the core personality traits associated with this ascendant.
            -   Explain how the **${element}** element shapes their inner world, motivations, and life path.
            -   Provide one or two pieces of enigmatic advice for their spiritual journey.
        4.  **Formatting:** Emphasize key esoteric concepts, names, and elements with **double asterisks**.
        5.  **Language:** The entire response **MUST** be in the **Persian language**.
        `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.7 } });
        return response.text || "تحلیل دریافت نشد.";
    } catch (error: any) {
        console.error("Error generating Rab al-Taleh analysis:", error.message);
        return "خطا در تولید تحلیل طالع ابجدی.";
    }
};

const compatibilitySchema = {
    type: Type.OBJECT,
    properties: {
        compatibilityScore: { type: Type.INTEGER, description: 'A compatibility score from 0 to 100.' },
        summary: { type: Type.STRING, description: 'A short, one-paragraph summary of the relationship dynamic.' },
        elementalAnalysis: { type: Type.STRING, description: 'A paragraph explaining how the two elements (e.g., Fire and Water) interact.' },
        recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'A list of 3-4 practical recommendations for improving the relationship.'
        },
    },
    required: ['compatibilityScore', 'summary', 'elementalAnalysis', 'recommendations'],
};

export const generateZodiacCompatibilityAnalysis = async (
    person1: { sign: string; element: string },
    person2: { sign: string; element: string }
): Promise<any | null> => {
    const prompt = `
        As an expert astrologer, provide a compatibility analysis between two individuals.

        Person 1: Zodiac sign **${person1.sign}** (Element: **${person1.element}**)
        Person 2: Zodiac sign **${person2.sign}** (Element: **${person2.element}**)

        Analyze their compatibility based on their zodiac signs and especially their elements. The tone should be insightful, constructive, and empathetic.

        **Instructions:**
        1.  **Compatibility Score:** Provide a score from 0 to 100 representing their overall compatibility.
        2.  **Summary:** Write a concise paragraph summarizing their core dynamic.
        3.  **Elemental Analysis:** Dedicate a paragraph to explaining the interaction between their elements (${person1.element} and ${person2.element}). How do these energies blend or clash?
        4.  **Recommendations:** Provide a list of 3-4 practical, actionable recommendations to help them improve their relationship.

        **CRITICAL INSTRUCTION: Your entire response must be in the Persian language, formatted as a JSON object adhering to the provided schema.**
    `;

    try {
        const response = await _generateContentWithRetry({ 
            model, 
            contents: prompt, 
            config: { 
                responseMimeType: "application/json", 
                responseSchema: compatibilitySchema,
                temperature: 0.6 
            }
        });
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating zodiac compatibility analysis:", error.message);
        return null;
    }
};

export const generateDestinyComparison = async (userName: string, famousPerson: {name: string, description: string}, commonTrait: string): Promise<GenerateContentResponse> => {
    const prompt = `
        **نقش:** تو یک حکیم و طالع‌بین هستی که در سرنوشت‌ها و تقدیرها کاوش می‌کنی.
        **وظیفه:** یک تحلیل دو قسمتی و الهام‌بخش در مورد شباهت‌های تقدیری بین «${userName}» و شخصیت مشهور «${famousPerson.name}» (${famousPerson.description}) بنویس.
        **نقطه اشتراک:** نقطه اشتراک اصلی آن‌ها "${commonTrait}" است.
        
        **دستورالعمل‌ها:**
        1.  **لحن:** حکیمانه، ادبی و کمی اسرارآمیز.
        2.  **زبان:** تمام پاسخ باید به زبان فارسی باشد.
        3.  **قالب:** کلمات کلیدی را با **دو ستاره** برجسته کن.

        **ساختار پاسخ:**

        **بخش اول (پتانسیل مشترک):**
        - در یک پاراگراف، توضیح بده که چگونه نقطه اشتراک ("${commonTrait}") یک پتانسیل مثبت در طالع ${userName} ایجاد می‌کند.
        - به یک موفقیت کلیدی در زندگی ${famousPerson.name} که از همین پتانسیل سرچشمه گرفته اشاره کن.
        - این بخش باید الهام‌بخش باشد و به ${userName} دیدگاهی برای رشد بدهد.

        **بخش دوم (دو روی سکه):**
        - این بخش را با مارکر **@@SHADOW@@** شروع کن.
        - در یک پاراگراف، با لحنی هشداردهنده و کیمیاگرانه، توضیح بده که همین نقطه اشتراک، چه چالش یا «سایه»ای را می‌تواند در مسیر زندگی ${userName} ایجاد کند.
        - به یک چالش یا اشتباه در زندگی ${famousPerson.name} که از همین «سایه» ناشی شده اشاره کن.
        - در پایان، یک راهکار یا دیدگاه برای تبدیل این چالش (سرب) به نقطه قوت (طلا) ارائه بده.
    `;
    
    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.8 } });
        return response;
    } catch (error: any) {
        console.error("Error generating destiny comparison:", error.message);
        throw new Error("خطا در تولید تحلیل شباهت تقدیر.");
    }
};

export const generateEventImpactAnalysis = async (eventName: string, ascendantSign: string): Promise<string> => {
    const prompt = `
        **Role:** You are a wise and concise astrologer.
        **Task:** Briefly explain the energetic impact of an upcoming astronomical event for a person with a specific ascendant sign.
        **Event:** ${eventName}
        **Ascendant Sign:** ${ascendantSign}

        **Instructions:**
        - The tone should be guiding and insightful.
        - Focus on the main opportunity and the main challenge this event brings for this specific ascendant.
        - Keep the response very short and concise (maximum 2-3 sentences).
        - **CRITICAL INSTRUCTION: Your entire response must be in the Persian language.**
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.7 } });
        return response.text || "تحلیل دریافت نشد.";
    } catch (error: any) {
        console.error("Error generating event impact analysis:", error.message);
        return "خطا در دریافت تحلیل. لطفاً بعداً دوباره امتحان کنید.";
    }
};

export const generateHafezFal = async (userName: string, userZodiac: string): Promise<string> => {
    const prompt = `
        **نقش:** تو خود حضرت حافظ شیرازی هستی.
        **وظیفه:** یک تفأل برای «${userName}» که طالع او «${userZodiac}» است، بزن.
        **نیت:** نیت او شناخت مسیر پیش رو، رفع موانع و گشایش در کارها است.
        
        **دستورالعمل‌ها:**
        1.  **انتخاب غزل:** یک غزل مناسب از دیوان خود به صورت تصادفی انتخاب کن.
        2.  **ارائه غزل:** ابتدا غزل کامل را بنویس. غزل باید دقیق و بدون تغییر باشد.
        3.  **جداساز:** بعد از پایان غزل، یک جداساز دقیقاً به این شکل قرار بده: @@TAFSIR@@
        4.  **تعبیر:** بعد از جداساز، تعبیر عرفانی غزل را با لحنی حکیمانه و آرامش‌بخش بنویس. تعبیر باید به نیت و شرایط ${userName} (طالع ${userZodiac}) اشاره داشته باشد و راهنمایی عملی برای او ارائه دهد.
        5.  **لحن:** لحن تو باید کاملاً شبیه به لسان‌الغیب، سرشار از استعاره‌های عرفانی و امیدبخش باشد.

        **دستورالعمل حیاتی: تمام پاسخ باید به زبان فارسی باشد.**
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { temperature: 0.9 } });
        return response.text || "ای صاحب فال، امروز کلام بر ما نازل نشد. در زمانی دیگر نیت کن.";
    } catch (error: any) {
        console.error("Error generating Hafez Fal:", error.message);
        return "خطا در ارتباط با حضرت حافظ. لطفاً دوباره تلاش کنید.";
    }
};

const esotericRulersSchema = {
    type: Type.OBJECT,
    properties: {
        malakName: { type: Type.STRING },
        jinnName: { type: Type.STRING },
        explanation: { type: Type.STRING },
    },
    required: ['malakName', 'jinnName', 'explanation'],
};

export const getEsotericRulers = async (name: string, abjadValue: number): Promise<EsotericRulers | null> => {
    const prompt = `
        **نقش:** تو یک استاد علوم خفیه و متخصص در علم حروف (جفر) هستی.
        **وظیفه:** بر اساس نام «${name}» و عدد ابجد کبیر آن (${abjadValue})، نام «ملک» (موکل روحانی) و «جن» (موکل زمینی) حاکم بر این نام را استخراج کن.
        **دستورالعمل‌ها:**
        1.  **استخراج نام:** از روش‌های سنتی علم حروف برای استخراج نام‌ها استفاده کن. نام‌ها باید معنادار، با ابهت و دارای اعراب کامل (حرکت‌گذاری) باشند.
        2.  **توضیح:** یک توضیح کوتاه و عرفانی در مورد چگونگی استخراج این نام‌ها و معنای آن‌ها ارائه بده.
        3.  **زبان:** تمام پاسخ باید به زبان فارسی باشد، به جز نام‌های استخراج شده که باید با اعراب کامل عربی باشند.
        **خروجی:** پاسخ باید یک شیء JSON با ساختار مشخص شده باشد.
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: esotericRulersSchema } });
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating esoteric rulers:", error.message);
        return null;
    }
};

const cleansingRitualSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        advice: { type: Type.STRING },
    },
    required: ['title', 'ingredients', 'steps', 'advice'],
};

export const getCleansingRitual = async (element: 'آتش' | 'خاک' | 'هوا' | 'آب'): Promise<CleansingRitual | null> => {
    const prompt = `
        **نقش:** تو یک حکیم و متخصص در طب سنتی و علوم طبیعی هستی.
        **وظیفه:** یک دستورالعمل «پاکسازی انرژتیک» ساده، امن و شخصی‌سازی شده برای فردی با عنصر وجودی **${element}** طراحی کن.
        **دستورالعمل‌ها:**
        1.  **محتوا:** دستورالعمل باید شامل یک عنوان، مواد لازم (بخور یا موارد غسل نمادین)، مراحل انجام و یک توصیه نهایی باشد.
        2.  **ایمنی:** تمام مواد و روش‌ها باید کاملاً امن، طبیعی و قابل دسترس باشند (مانند گیاهان دارویی رایج، نمک دریا و...). از توصیه موارد خطرناک یا غیرمعمول جداً خودداری کن.
        3.  **لحن:** حکیمانه، آرامش‌بخش و راهنمایی‌کننده.
        4.  **زبان:** تمام پاسخ باید به زبان فارسی باشد.
        **خروجی:** پاسخ باید یک شیء JSON با ساختار مشخص شده باشد.
    `;

    try {
        const response = await _generateContentWithRetry({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: cleansingRitualSchema } });
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating cleansing ritual:", error.message);
        return null;
    }
};

const tradingDayAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        day: { type: Type.INTEGER },
        rating: { type: Type.STRING, enum: ['عالی', 'خوب', 'متوسط', 'پرریسک', 'بسیار پرریسک'] },
        summary: { type: Type.STRING },
        positiveAspects: { type: Type.ARRAY, items: { type: Type.STRING } },
        negativeAspects: { type: Type.ARRAY, items: { type: Type.STRING } },
        advice: { type: Type.STRING },
    },
    required: ['day', 'rating', 'summary', 'positiveAspects', 'negativeAspects', 'advice'],
};

export const generateTradingAstrologyAnalysisForMonth = async (year: number, month: number): Promise<TradingDayAnalysis[] | null> => {
    const prompt = `
        **نقش:** تو یک منجم مالی (Financial Astrologer) بسیار حرفه‌ای هستی.
        **وظیفه:** برای هر روز از ماه ${month}/${year} (میلادی)، یک تحلیل نجومی برای تریدینگ ارائه بده.
        **دستورالعمل‌ها:**
        1.  **تحلیل روزانه:** برای هر روز، تأثیرات کلیدی سیارات (به خصوص عطارد، مریخ، مشتری، زحل) و فاز ماه را بر روانشناسی بازار و پتانسیل نوسانات تحلیل کن.
        2.  **رتبه‌بندی:** هر روز را با یکی از رتبه‌های زیر مشخص کن: 'عالی', 'خوب', 'متوسط', 'پرریسک', 'بسیار پرریسک'.
        3.  **ارائه جزئیات:** برای هر روز، یک خلاصه، دلایل مثبت (مثلاً تثلیث مشتری و زهره)، دلایل منفی (مثلاً تربیع مریخ و زحل یا عطارد رجعی) و یک توصیه عملی برای تریدرها ارائه بده.
        4.  **زبان:** تمام پاسخ باید به زبان فارسی باشد.
        **خروجی:** یک آرایه از اشیاء JSON که هر شیء مربوط به یک روز و مطابق با اسکیمای ارائه‌شده است.
    `;

    try {
        const response = await _generateContentWithRetry({ 
            model, 
            contents: prompt, 
            config: { 
                responseMimeType: "application/json", 
                responseSchema: {
                    type: Type.ARRAY,
                    items: tradingDayAnalysisSchema
                },
                temperature: 0.5 
            }
        });
        return _parseGeminiJsonResponse(response);
    } catch (error: any) {
        console.error("Error generating trading astrology analysis for month:", error.message);
        return null;
    }
};