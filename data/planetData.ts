// استفاده از 'import type' برای جلوگیری از تداخل در زمان Build
import type { SolarSystemPlanet } from '../types';

// خط زیر را حذف کردیم: export { SolarSystemPlanet };

export const solarSystemPlanets: SolarSystemPlanet[] = [
    {
        id: 'sun',
        name: 'خورشید',
        symbol: '☉',
        radius: 0,
        size: 20,
        speed: 0,
        color: '#f59e0b',
        description: 'خورشید، ستاره مرکزی منظومه شمسی، منبع حیات و انرژی است. در طالع‌بینی، نماد اراده، هویت اصلی و جوهر وجودی فرد است.'
    },
    {
        id: 'mercury',
        name: 'عطارد',
        symbol: '☿',
        radius: 60,
        size: 4,
        speed: 28.8,
        color: '#a1a1aa',
        description: 'نزدیک‌ترین سیاره به خورشید، نماد ارتباطات، ذهن، منطق و تجارت است. عطارد بر نحوه تفکر و صحبت کردن ما حاکم است.'
    },
    {
        id: 'venus',
        name: 'زهره',
        symbol: '♀',
        radius: 90,
        size: 7,
        speed: 73.6,
        color: '#f472b6',
        description: 'سیاره عشق، زیبایی، هنر و ارزش‌ها. زهره بر روابط عاطفی، لذت‌ها و احساسات ما نسبت به زیبایی‌شناسی تأثیر می‌گذارد.'
    },
    {
        id: 'earth',
        name: 'زمین',
        symbol: '⊕',
        radius: 125,
        size: 7,
        speed: 120,
        color: '#3b82f6',
        description: 'سیاره ما، نماد واقعیت مادی، طبیعت و تجربه انسانی. در مدل زمین‌مرکزی، مرکز کیهان است.'
    },
    {
        id: 'mars',
        name: 'مریخ',
        symbol: '♂',
        radius: 160,
        size: 5,
        speed: 225.6,
        color: '#ef4444',
        description: 'سیاره سرخ، نماد انرژی، شجاعت، اقدام، و همچنین پرخاشگری و درگیری. مریخ نحوه ابراز خشم و پیگیری اهدافمان را نشان می‌دهد.'
    },
    {
        id: 'jupiter',
        name: 'مشتری',
        symbol: '♃',
        radius: 220,
        size: 14,
        speed: 1423.2,
        color: '#818cf8',
        description: 'بزرگترین سیاره منظومه شمسی، نماد شانس، گسترش، فلسفه و خوش‌بینی. مشتری به عنوان «سعد اکبر» شناخته می‌شود.'
    },
    {
        id: 'saturn',
        name: 'زحل',
        symbol: '♄',
        radius: 290,
        size: 12,
        speed: 3534,
        color: '#fcd34d',
        description: 'سیاره ساختار، انضباط، محدودیت‌ها و درس‌های کارمایی. زحل که به «نحس اکبر» معروف است، به ما مسئولیت‌پذیری و صبر می‌آموزد.',
        ring: {
            radius: 30,
            thickness: 3
        }
    },
];