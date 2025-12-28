

import { useMemo } from 'react';

export const useZodiacData = () => {
    return useMemo(() => [
        {
            traditional: 'حمل', modern: 'Aries', planet: 'مریخ', planetType: 'علوی',
            element: 'آتش', nature: 'گرم و خشک', auspiciousness: 'نحس',
            color: 'border-red-500', elementBg: 'bg-red-900/20', iconColor: 'text-red-400', auspiciousnessColor: 'text-red-400',
            svgPath: 'M 1 6 L 1 6 C 4 1 8 1 11 6 M 6 3 L 6 11',
            symbol: '♈︎'
        },
        {
            traditional: 'ثور', modern: 'Taurus', planet: 'زهره', planetType: 'سفلی',
            element: 'خاک', nature: 'سرد و خشک', auspiciousness: 'سعد',
            color: 'border-emerald-500', elementBg: 'bg-emerald-900/20', iconColor: 'text-emerald-400', auspiciousnessColor: 'text-green-400',
            svgPath: 'M 6 1 C 2 1 1 4 1 6 C 1 8 2 11 6 11 C 10 11 11 8 11 6 C 11 4 10 1 6 1 M 6 1 L 6 -2',
            symbol: '♉︎'
        },
        {
            traditional: 'جوزا', modern: 'Gemini', planet: 'عطارد', planetType: 'سفلی',
            element: 'هوا', nature: 'گرم و مرطوب', auspiciousness: 'ممتزج',
            color: 'border-yellow-500', elementBg: 'bg-yellow-900/20', iconColor: 'text-yellow-400', auspiciousnessColor: 'text-yellow-400',
            svgPath: 'M 1 2 L 11 2 M 1 10 L 11 10 M 3 2 L 3 10 M 9 2 L 9 10',
            symbol: '♊︎'
        },
        {
            traditional: 'سرطان', modern: 'Cancer', planet: 'قمر', planetType: 'سفلی',
            element: 'آب', nature: 'سرد و مرطوب', auspiciousness: 'نیر',
            color: 'border-sky-500', elementBg: 'bg-sky-900/20', iconColor: 'text-sky-400', auspiciousnessColor: 'text-gray-300',
            svgPath: 'M 2 5 C 2 1 6 1 6 5 M 10 7 C 10 11 6 11 6 7',
            symbol: '♋︎'
        },
        {
            traditional: 'اسد', modern: 'Leo', planet: 'شمس', planetType: 'سفلی',
            element: 'آتش', nature: 'گرم و خشک', auspiciousness: 'نیر',
            color: 'border-orange-500', elementBg: 'bg-orange-900/20', iconColor: 'text-orange-400', auspiciousnessColor: 'text-gray-300',
            svgPath: 'M 1 6 C 1 1 6 1 6 6 C 6 11 11 11 11 6 L 11 9 C 11 12 8 12 8 9',
            symbol: '♌︎'
        },
        {
            traditional: 'سنبله', modern: 'Virgo', planet: 'عطارد', planetType: 'سفلی',
            element: 'خاک', nature: 'سرد و خشک', auspiciousness: 'ممتزج',
            color: 'border-green-500', elementBg: 'bg-green-900/20', iconColor: 'text-green-400', auspiciousnessColor: 'text-yellow-400',
            svgPath: 'M 1 1 L 1 11 L 3 11 L 3 1 L 5 1 L 5 11 L 7 11 L 7 1 L 9 1 L 9 8 C 9 12 6 12 6 8',
            symbol: '♍︎'
        },
        {
            traditional: 'میزان', modern: 'Libra', planet: 'زهره', planetType: 'سفلی',
            element: 'هوا', nature: 'گرم و مرطوب', auspiciousness: 'سعد',
            color: 'border-pink-500', elementBg: 'bg-pink-900/20', iconColor: 'text-pink-400', auspiciousnessColor: 'text-green-400',
            svgPath: 'M 1 10 L 11 10 M 1 10 L 6 5 L 11 10 M 3 10 L 3 8 L 9 8 L 9 10',
            symbol: '♎︎'
        },
        {
            traditional: 'عقرب', modern: 'Scorpio', planet: 'مریخ', planetType: 'علوی',
            element: 'آب', nature: 'سرد و مرطوب', auspiciousness: 'نحس',
            color: 'border-purple-500', elementBg: 'bg-purple-900/20', iconColor: 'text-purple-400', auspiciousnessColor: 'text-red-400',
            svgPath: 'M 1 1 L 1 11 L 3 11 L 3 1 L 5 1 L 5 11 L 7 11 L 7 1 L 9 1 L 9 6 L 12 3',
            symbol: '♏︎'
        },
        {
            traditional: 'قوس', modern: 'Sagittarius', planet: 'مشتری', planetType: 'علوی',
            element: 'آتش', nature: 'گرم و خشک', auspiciousness: 'سعد',
            color: 'border-indigo-500', elementBg: 'bg-indigo-900/20', iconColor: 'text-indigo-400', auspiciousnessColor: 'text-green-400',
            svgPath: 'M 1 11 L 11 1 M 6 6 L 11 6 M 6 1 L 6 6',
            symbol: '♐︎'
        },
        {
            traditional: 'جدی', modern: 'Capricorn', planet: 'زحل', planetType: 'علوی',
            element: 'خاک', nature: 'سرد و خشک', auspiciousness: 'نحس',
            color: 'border-gray-500', elementBg: 'bg-gray-900/20', iconColor: 'text-gray-400', auspiciousnessColor: 'text-red-400',
            svgPath: 'M 1 5 L 3 1 L 6 5 L 6 1 C 8 4 9 5 11 4',
            symbol: '♑︎'
        },
        {
            traditional: 'دلو', modern: 'Aquarius', planet: 'زحل', planetType: 'علوی',
            element: 'هوا', nature: 'گرم و مرطوب', auspiciousness: 'نحس',
            color: 'border-teal-500', elementBg: 'bg-teal-900/20', iconColor: 'text-teal-400', auspiciousnessColor: 'text-red-400',
            svgPath: 'M 1 4 L 3 6 L 5 4 L 7 6 L 9 4 L 11 6 M 1 8 L 3 10 L 5 8 L 7 10 L 9 8 L 11 10',
            symbol: '♒︎'
        },
        {
            traditional: 'حوت', modern: 'Pisces', planet: 'مشتری', planetType: 'علوی',
            element: 'آب', nature: 'سرد و مرطوب', auspiciousness: 'سعد',
            color: 'border-blue-500', elementBg: 'bg-blue-900/20', iconColor: 'text-blue-400', auspiciousnessColor: 'text-green-400',
            svgPath: 'M 1 9 C 5 13 7 13 11 9 M 1 3 C 5 -1 7 -1 11 3 M 6 1 L 6 11',
            symbol: '♓︎'
        },
    ], []);
};