
import { useMemo } from 'react';

export const useZodiacRulers = () => {
    return useMemo(() => [
      { id: 1, sign: 'حمل', ruler: 'مریخ' },
      { id: 2, sign: 'ثور', ruler: 'زهره' },
      { id: 3, sign: 'جوزا', ruler: 'عطارد' },
      { id: 4, sign: 'سرطان', ruler: 'قمر' },
      { id: 5, sign: 'اسد', ruler: 'شمس' },
      { id: 6, sign: 'سنبله', ruler: 'عطارد' },
      { id: 7, sign: 'میزان', ruler: 'زهره' },
      { id: 8, sign: 'عقرب', ruler: 'مریخ' },
      { id: 9, sign: 'قوس', ruler: 'مشتری' },
      { id: 10, sign: 'جدی', ruler: 'زحل' },
      { id: 11, sign: 'دلو', ruler: 'زحل' },
      { id: 12, sign: 'حوت', ruler: 'مشتری' },
    ], []);
};


export const useWeeklyRulers = () => {
  return useMemo(() => [
    { day: 'شنبه', ruler: 'زحل', type: 'نحس', color: 'text-red-400' },
    { day: 'یک‌شنبه', ruler: 'شمس', type: 'سعد (نیر اعظم)', color: 'text-gray-300' },
    { day: 'دوشنبه', ruler: 'قمر', type: 'سعد (نیر اعظم)', color: 'text-gray-300' },
    { day: 'سه‌شنبه', ruler: 'مریخ', type: 'نحس', color: 'text-red-400' },
    { day: 'چهارشنبه', ruler: 'عطارد', type: 'ممتزج', color: 'text-yellow-400' },
    { day: 'پنج‌شنبه', ruler: 'مشتری', type: 'سعد', color: 'text-green-400' },
    { day: 'جمعه', ruler: 'زهره', type: 'سعد', color: 'text-green-400' },
  ], []);
};


export const usePlanetDetails = () => {
  return useMemo(() => ({
    'زحل': { description: 'روز زحل برای کارهای ساختمانی، کشاورزی و امور مربوط به افراد مسن مناسب است.' },
    'شمس': { description: 'روز خورشید برای ملاقات با افراد مهم، درخواست از مقامات و امور مربوط به شهرت مناسب است.' },
    'قمر': { description: 'روز ماه برای امور روزمره، سفر کوتاه و امور خانگی مناسب است.' },
    'مریخ': { description: 'روز مریخ برای امور ورزشی، رقابت و کارهای نیازمند شجاعت مناسب است.' },
    'عطارد': { description: 'روز عطارد برای نوشتن، مطالعه و امور تجاری مناسب است.' },
    'مشتری': { description: 'روز مشتری برای امور مالی، شروع کسب و کار و ازدواج مناسب است.' },
    'زهره': { description: 'روز زهره برای امور عاطفی، خرید و فروش و تفریح مناسب است.' },
  }), []);
};
