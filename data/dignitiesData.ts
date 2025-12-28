
import { useMemo } from 'react';

interface DignityInfo {
    type: string;
    explanation: string;
    color: string;
}

export const useDignitiesData = () => {
    const planets = useMemo(() => [
        { id: 'sun', name: 'خورشید' },
        { id: 'moon', name: 'ماه' },
        { id: 'mercury', name: 'عطارد' },
        { id: 'venus', name: 'زهره' },
        { id: 'mars', name: 'مریخ' },
        { id: 'jupiter', name: 'مشتری' },
        { id: 'saturn', name: 'زحل' },
    ], []);

    const signs = useMemo(() => [
        { id: 'aries', name: 'حمل' },
        { id: 'taurus', name: 'ثور' },
        { id: 'gemini', name: 'جوزا' },
        { id: 'cancer', name: 'سرطان' },
        { id: 'leo', name: 'اسد' },
        { id: 'virgo', name: 'سنبله' },
        { id: 'libra', name: 'میزان' },
        { id: 'scorpio', name: 'عقرب' },
        { id: 'sagittarius', name: 'قوس' },
        { id: 'capricorn', name: 'جدی' },
        { id: 'aquarius', name: 'دلو' },
        { id: 'pisces', name: 'حوت' },
    ], []);

    const dignities: Record<string, Record<string, DignityInfo>> = useMemo(() => ({
        sun: {
            leo: { type: 'در خانه (حاکمیت)', explanation: 'خورشید در خانه خود است و در اوج قدرت و درخشش قرار دارد.', color: 'text-amber-400' },
            aries: { type: 'در شرف', explanation: 'خورشید در برج آتشین حمل به اوج قدرت ابراز وجود و رهبری می‌رسد.', color: 'text-green-400' },
            aquarius: { type: 'در وبال', explanation: 'خورشید در مقابل خانه خود قرار گرفته و انرژی فردی آن در جمع‌گرایی دلو ضعیف می‌شود.', color: 'text-gray-400' },
            libra: { type: 'در هبوط', explanation: 'انرژی فردگرای خورشید در برج تعادل و دیگران‌محوری میزان، ضعیف و بی‌اثر می‌شود.', color: 'text-red-400' },
        },
        moon: {
            cancer: { type: 'در خانه (حاکمیت)', explanation: 'ماه در خانه خود است و احساسات، شهود و غریزه در قوی‌ترین حالت خود قرار دارند.', color: 'text-amber-400' },
            taurus: { type: 'در شرف', explanation: 'ماه در برج ثور به آرامش و ثبات می‌رسد و احساسات به شکلی سازنده ابراز می‌شوند.', color: 'text-green-400' },
            capricorn: { type: 'در وبال', explanation: 'احساسات ماه در برج سرد و منطقی جدی، سرکوب یا محدود می‌شود.', color: 'text-gray-400' },
            scorpio: { type: 'در هبوط', explanation: 'ماه در برج هیجانات شدید عقرب، بی‌قرار و متلاطم است.', color: 'text-red-400' },
        },
        mercury: {
            gemini: { type: 'در خانه (حاکمیت)', explanation: 'عطارد در خانه خود است و ذهن، ارتباطات و یادگیری در بهترین حالت خود قرار دارد.', color: 'text-amber-400' },
            virgo: { type: 'در خانه (حاکمیت)', explanation: 'عطارد در دیگر خانه خود، سنبله، قدرت تحلیل، دقت و سازماندهی بالایی پیدا می‌کند.', color: 'text-amber-400' },
            sagittarius: { type: 'در وبال', explanation: 'ذهن جزئی‌نگر عطارد در برج کلی‌نگر و فلسفی قوس، سردرگم و پراکنده می‌شود.', color: 'text-gray-400' },
            pisces: { type: 'در هبوط', explanation: 'منطق عطارد در برج احساسی و شهودی حوت، ضعیف و بی‌اثر می‌شود.', color: 'text-red-400' },
        },
        venus: {
            taurus: { type: 'در خانه (حاکمیت)', explanation: 'زهره در خانه زمینی خود بر لذت‌های مادی، هنر و ثبات تأکید دارد.', color: 'text-amber-400' },
            libra: { type: 'در خانه (حاکمیت)', explanation: 'زهره در خانه هوایی خود بر روابط، زیبایی‌شناسی و تعادل اجتماعی تمرکز دارد.', color: 'text-amber-400' },
            pisces: { type: 'در شرف', explanation: 'انرژی عشق زمینی زهره در برج معنوی و فداکار حوت به اوج روحانی خود می‌رسد.', color: 'text-green-400' },
            aries: { type: 'در وبال', explanation: 'لطافت زهره در برج تهاجمی حمل، بی‌قرار و عجول می‌شود.', color: 'text-gray-400' },
            scorpio: { type: 'در وبال', explanation: 'هارمونی زهره در برج هیجانات شدید و مالکیت‌گرای عقرب، دچار تنش می‌شود.', color: 'text-gray-400' },
            virgo: { type: 'در هبوط', explanation: 'لذت‌جویی زهره در برج منتقد و کمال‌گرای سنبله، سرکوب و محدود می‌شود.', color: 'text-red-400' },
        },
        mars: {
            aries: { type: 'در خانه (حاکمیت)', explanation: 'مریخ در خانه خود است و انرژی، شجاعت و قدرت اقدام در بالاترین سطح قرار دارد.', color: 'text-amber-400' },
            scorpio: { type: 'در خانه (حاکمیت)', explanation: 'مریخ در دیگر خانه خود، عقرب، انرژی خود را به صورت متمرکز، استراتژیک و عمیق به کار می‌گیرد.', color: 'text-amber-400' },
            capricorn: { type: 'در شرف', explanation: 'انرژی تهاجمی مریخ در برج ساختارمند جدی، به شکلی منظم و هدفمند برای رسیدن به موفقیت به کار گرفته می‌شود.', color: 'text-green-400' },
            libra: { type: 'در وبال', explanation: 'قدرت اقدام مریخ در برج تعادل و تردید میزان، ضعیف و بی‌اثر می‌شود.', color: 'text-gray-400' },
            taurus: { type: 'در وبال', explanation: 'عجله مریخ در برج کند و صبور ثور، سرکوب و ناکارآمد می‌شود.', color: 'text-gray-400' },
            cancer: { type: 'در هبوط', explanation: 'انرژی مستقیم مریخ در برج احساسی و محتاط سرطان، ضعیف و سرکوب می‌شود.', color: 'text-red-400' },
        },
        jupiter: {
            sagittarius: { type: 'در خانه (حاکمیت)', explanation: 'مشتری در خانه خود است و خوش‌بینی، فلسفه و گسترش در اوج قرار دارد.', color: 'text-amber-400' },
            pisces: { type: 'در خانه (حاکمیت)', explanation: 'مشتری در دیگر خانه خود، حوت، انرژی خود را به صورت معنوی، شهودی و همدلانه ابراز می‌کند.', color: 'text-amber-400' },
            cancer: { type: 'در شرف', explanation: 'انرژی گسترش‌دهنده مشتری در برج خانواده و احساسات سرطان، به اوج بخشندگی و حمایتگری می‌رسد.', color: 'text-green-400' },
            gemini: { type: 'در وبال', explanation: 'نگاه کلان مشتری در برج جزئی‌نگر و کنجکاو جوزا، پراکنده و سطحی می‌شود.', color: 'text-gray-400' },
            virgo: { type: 'در وبال', explanation: 'خوش‌بینی مشتری در برج منتقد و محتاط سنبله، محدود و ضعیف می‌شود.', color: 'text-gray-400' },
            capricorn: { type: 'در هبوط', explanation: 'گسترش مشتری در برج محدودکننده و ساختارمند جدی، سرکوب و بی‌اثر می‌شود.', color: 'text-red-400' },
        },
        saturn: {
            capricorn: { type: 'در خانه (حاکمیت)', explanation: 'زحل در خانه خود است و انضباط، ساختار و مسئولیت‌پذیری در قوی‌ترین حالت قرار دارد.', color: 'text-amber-400' },
            aquarius: { type: 'در خانه (حاکمیت)', explanation: 'زحل در دیگر خانه خود، دلو، انرژی خود را برای ساختن ساختارهای اجتماعی و قوانین نوآورانه به کار می‌گیرد.', color: 'text-amber-400' },
            libra: { type: 'در شرف', explanation: 'انرژی ساختارساز زحل در برج تعادل و عدالت میزان، به اوج انصاف و قانون‌مداری می‌رسد.', color: 'text-green-400' },
            cancer: { type: 'در وبال', explanation: 'سردی و انضباط زحل در برج گرم و احساسی سرطان، احساس بیگانگی و طردشدگی می‌کند.', color: 'text-gray-400' },
            leo: { type: 'در وبال', explanation: 'قانون‌مداری زحل در برج فردگرا و فرمانروای اسد، دچار چالش می‌شود.', color: 'text-gray-400' },
            aries: { type: 'در هبوط', explanation: 'صبر و احتیاط زحل در برج عجول و بی‌باک حمل، ضعیف و بی‌اثر می‌شود.', color: 'text-red-400' },
        },
    }), []);

    return { planets, signs, dignities };
};
