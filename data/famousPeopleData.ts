
import { useMemo } from 'react';
import { calculateAbjad } from '../utils/abjad';
import { getZodiacSign } from '../utils/zodiac';
import { ZodiacSignName } from '../types';

export type PersonType = 'positive' | 'negative' | 'neutral';

export interface FamousPerson {
    id: string;
    name: string;
    birthDate: string; // YYYY/MM/DD format for consistency
    description: string;
    imageUrl: string;
    type: PersonType;
}

export interface ProcessedFamousPerson extends FamousPerson {
    zodiacSign: ZodiacSignName | null;
    abjadValue: number;
}


// Using Gregorian dates for easier data entry
const people: FamousPerson[] = [
    // Scientists
    { id: 'einstein', name: 'آلبرت اینشتین', birthDate: '1879/03/14', description: 'فیزیکدان نظری، نظریه نسبیت', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/800px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg', type: 'positive' },
    { id: 'newton', name: 'اسحاق نیوتن', birthDate: '1643/01/04', description: 'فیزیکدان و ریاضیدان، قانون جاذبه', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg/800px-Portrait_of_Sir_Isaac_Newton%2C_1689.jpg', type: 'positive' },
    { id: 'curie', name: 'ماری کوری', birthDate: '1867/11/07', description: 'فیزیکدان و شیمیدان، پیشگام رادیواکتیویته', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920.jpg/800px-Marie_Curie_c._1920.jpg', type: 'positive' },
    { id: 'avicenna', name: 'ابن سینا', birthDate: '980/08/22', description: 'فیلسوف و پزشک بزرگ ایرانی', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Avicenna_portrait.jpg/800px-Avicenna_portrait.jpg', type: 'positive' },
    // Artists
    { id: 'davinci', name: 'لئوناردو داوینچی', birthDate: '1452/04/15', description: 'هنرمند و دانشمند دوره رنسانس', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Francesco_Melzi_-_Portrait_of_Leonardo_-_WGA14795.jpg/800px-Francesco_Melzi_-_Portrait_of_Leonardo_-_WGA14795.jpg', type: 'positive' },
    { id: 'hafiz', name: 'حافظ شیرازی', birthDate: '1325/01/01', description: 'شاعر بزرگ ایرانی', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Hafiz.jpg', type: 'positive' },
    { id: 'beethoven', name: 'لودویگ فان بتهوون', birthDate: '1770/12/17', description: 'آهنگساز بزرگ آلمانی', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg', type: 'positive' },
    { id: 'ferdowsi', name: 'فردوسی', birthDate: '940/01/03', description: 'حماسه‌سرای بزرگ و خالق شاهنامه', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ferdowsi_Statue_in_Tus.jpg/800px-Ferdowsi_Statue_in_Tus.jpg', type: 'positive' },
    // Leaders
    { id: 'cyrus', name: 'کوروش بزرگ', birthDate: '600/01/01', description: 'بنیان‌گذار شاهنشاهی هخامنشی', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Cyrus_the_Great_in_Pasargadae.jpg/800px-Cyrus_the_Great_in_Pasargadae.jpg', type: 'positive' },
    { id: 'gandhi', name: 'مهاتما گاندی', birthDate: '1869/10/02', description: 'رهبر استقلال هند', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Portrait_Gandhi.jpg/800px-Portrait_Gandhi.jpg', type: 'positive' },
    { id: 'napoleon', name: 'ناپلئون بناپارت', birthDate: '1769/08/15', description: 'امپراتور فرانسه', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/800px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg', type: 'neutral' },
    // Negative Figures
    { id: 'hitler', name: 'آدولف هیتلر', birthDate: '1889/04/20', description: 'دیکتاتور آلمان نازی', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/800px-Hitler_portrait_crop.jpg', type: 'negative' },
    { id: 'genghis', name: 'چنگیز خان', birthDate: '1162/05/31', description: 'بنیان‌گذار امپراتوری مغول', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/YuanEmperorAlbumGenghisFull.jpg/800px-YuanEmperorAlbumGenghisFull.jpg', type: 'negative' },
    { id: 'stalin', name: 'ژوزف استالین', birthDate: '1878/12/18', description: 'دیکتاتور اتحاد جماهیر شوروی', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Stalin_Full_Image.jpg/800px-Stalin_Full_Image.jpg', type: 'negative' },
];

export const useFamousPeopleData = (): ProcessedFamousPerson[] => {
    return useMemo(() => {
        return people.map(person => ({
            ...person,
            zodiacSign: getZodiacSign(person.birthDate),
            abjadValue: calculateAbjad(person.name)
        }));
    }, []);
};
