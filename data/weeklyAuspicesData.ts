
import { useMemo } from 'react';

export const useWeeklyAuspicesData = () => {
    return useMemo(() => [
        { 
            day: 'شنبه', 
            type: 'نحس', 
            description: 'روز زحل. مناسب برای کارهای سنگین، کشاورزی، ساخت و ساز و اموری که به صبر و درازمدت نیاز دارند.', 
            icon: '⚠️', 
            color: 'red', 
            planet: 'زحل' 
        },
        { 
            day: 'یک‌شنبه', 
            type: 'سعد', 
            description: 'روز خورشید. مناسب برای ملاقات با بزرگان و حاکمان، درخواست کردن، شروع کارهای مهم و امور مربوط به رهبری.', 
            icon: '✨', 
            color: 'green', 
            planet: 'شمس' 
        },
        { 
            day: 'دوشنبه', 
            type: 'سعد', 
            description: 'روز ماه. مناسب برای امور خانوادگی، تجارت، سفر (به خصوص دریایی) و ارتباط با عموم مردم.', 
            icon: '✨', 
            color: 'green', 
            planet: 'قمر' 
        },
        { 
            day: 'سه‌شنبه', 
            type: 'نحس', 
            description: 'روز مریخ. مناسب برای امور جراحی، کارهای نیازمند به شجاعت، ورزش و کارهای سخت و دشوار.', 
            icon: '⚠️', 
            color: 'red', 
            planet: 'مریخ' 
        },
        { 
            day: 'چهارشنبه', 
            type: 'ممتزج', 
            description: 'روز عطارد. مناسب برای نوشتن، یادگیری، حسابرسی، شروع تحصیل و امور مربوط به تجارت و ارتباطات.', 
            icon: '↔️', 
            color: 'red', // Note: Mixed is often considered leaning towards malefic in old texts
            planet: 'عطارد' 
        },
        { 
            day: 'پنج‌شنبه', 
            type: 'سعد', 
            description: 'روز مشتری. مناسب برای دعا، ازدواج، شروع کارهای نیک، طلب علم و امور مالی.', 
            icon: '✨', 
            color: 'green', 
            planet: 'مشتری' 
        },
        { 
            day: 'جمعه', 
            type: 'سعد', 
            description: 'روز زهره. مناسب برای امور مربوط به عشق و محبت، هنر، تفریح، خرید و امور مربوط به زیبایی و لذت.', 
            icon: '✨', 
            color: 'green', 
            planet: 'زهره' 
        },
    ], []);
};
