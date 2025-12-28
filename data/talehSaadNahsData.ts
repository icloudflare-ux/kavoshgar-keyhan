import { useMemo } from 'react';

type Quality = 'saad' | 'nahs' | 'semi-saad' | 'semi-nahs' | 'neutral' | 'swing';

// Hardcoded translations, removing the need for i18n context
const translations: { [key: string]: string } = {
  'taleh_asmi_1_title': 'عدد ۱ (شمس)', 'taleh_asmi_1_desc': 'سعد. نشان‌دهنده رهبری، قدرت و موفقیت.',
  'taleh_asmi_2_title': 'عدد ۲ (قمر)', 'taleh_asmi_2_desc': 'نیمه سعد. دارای نوسان، اما عموماً مثبت و شهودی.',
  'taleh_asmi_3_title': 'عدد ۳ (مشتری)', 'taleh_asmi_3_desc': 'سعد اکبر. نماد شانس، فراوانی و حمایت.',
  'taleh_asmi_4_title': 'عدد ۴ (رأس/گره شمالی)', 'taleh_asmi_4_desc': 'نیمه نحس. نشان‌دهنده کارما، چالش‌های ناگهانی و مسیر غیرمعمول.',
  'taleh_asmi_5_title': 'عدد ۵ (عطارد)', 'taleh_asmi_5_desc': 'سعد. نشان‌دهنده هوش، ارتباطات و موفقیت در تجارت.',
  'taleh_asmi_6_title': 'عدد ۶ (زهره)', 'taleh_asmi_6_desc': 'سعد اصغر. نماد عشق، هنر و روابط اجتماعی.',
  'taleh_asmi_7_title': 'عدد ۷ (ذنب/گره جنوبی)', 'taleh_asmi_7_desc': 'نیمه نحس. نشان‌دهنده محدودیت‌ها، تأخیر و نیاز به رها کردن گذشته.',
  'taleh_asmi_8_title': 'عدد ۸ (زحل)', 'taleh_asmi_8_desc': 'متغیر (ممتزج). می‌تواند هم ساختارساز و هم محدودکننده باشد. نیاز به تلاش و انضباط دارد.',
  'taleh_asmi_9_title': 'عدد ۹ (مریخ)', 'taleh_asmi_9_desc': 'متغیر (ممتزج). انرژی، شجاعت و توانایی اقدام، اما همراه با خطر درگیری و تندی.',
  'day_saturday': 'شنبه', 'planet_saturn': 'زحل', 'day_of_birth_sat_desc': 'نحس. ممکن است با محدودیت‌ها و تأخیرها روبرو شوند اما دارای صبر و استقامت هستند.',
  'day_sunday': 'یک‌شنبه', 'planet_sun': 'شمس', 'day_of_birth_sun_desc': 'سعد. دارای اعتماد به نفس، قدرت رهبری و تمایل به درخشش.',
  'day_monday': 'دوشنبه', 'planet_moon': 'قمر', 'day_of_birth_mon_desc': 'سعد. احساساتی، شهودی و دارای ارتباط قوی با خانواده و مردم.',
  'day_tuesday': 'سه‌شنبه', 'planet_mars': 'مریخ', 'day_of_birth_tue_desc': 'نحس. شجاع، پرانرژی و رقابت‌جو، اما مستعد درگیری و عجله.',
  'day_wednesday': 'چهارشنبه', 'planet_mercury': 'عطارد', 'day_of_birth_wed_desc': 'نیمه نحس. باهوش، کنجکاو و دارای قدرت ارتباطی، اما ممکن است دچار اضطراب و دودلی شوند.',
  'day_thursday': 'پنج‌شنبه', 'planet_jupiter': 'مشتری', 'day_of_birth_thu_desc': 'سعد. خوش‌بین، سخاوتمند و اغلب از شانس و حمایت برخوردارند.',
  'day_friday': 'جمعه', 'planet_venus': 'زهره', 'day_of_birth_fri_desc': 'سعد. اجتماعی، هنردوست، و در روابط و امور مالی موفق.',
  'adad_ruhi_1_title': 'عدد ۱', 'adad_ruhi_1_desc': 'سعد. انرژی حیاتی بالا و اراده قوی.',
  'adad_ruhi_2_title': 'عدد ۲', 'adad_ruhi_2_desc': 'متغیر. روحیه حساس و نیازمند به تعادل.',
  'adad_ruhi_3_title': 'عدد ۳', 'adad_ruhi_3_desc': 'متغیر. نیاز به بیان خود و ارتباط.',
  'adad_ruhi_4_title': 'عدد ۴', 'adad_ruhi_4_desc': 'نیمه نحس. روحیه عمل‌گرا اما گاهی درگیر محدودیت‌ها.',
  'adad_ruhi_5_title': 'عدد ۵', 'adad_ruhi_5_desc': 'متغیر. نیاز به آزادی، تنوع و تجربه.',
  'adad_ruhi_6_title': 'عدد ۶', 'adad_ruhi_6_desc': 'متغیر. روحیه مسئولیت‌پذیر و خانواده‌دوست.',
  'adad_ruhi_7_title': 'عدد ۷', 'adad_ruhi_7_desc': 'متغیر. نیاز به تنهایی، تفکر و معنویت.',
  'adad_ruhi_8_title': 'عدد ۸', 'adad_ruhi_8_desc': 'متغیر. پتانسیل قدرت و موفقیت مادی، اما با چالش‌های بزرگ.',
  'adad_ruhi_9_title': 'عدد ۹', 'adad_ruhi_9_desc': 'متغیر. روحیه آرمان‌گرا و انسان‌دوست.',
};

const t = (key: string) => translations[key] || key;


export const useTalehData = () => {

  const talehAsmiData: { number: number; title: string; quality: Quality; description: string }[] = useMemo(() => [
    { number: 1, title: t('taleh_asmi_1_title'), quality: 'saad', description: t('taleh_asmi_1_desc') },
    { number: 2, title: t('taleh_asmi_2_title'), quality: 'semi-saad', description: t('taleh_asmi_2_desc') },
    { number: 3, title: t('taleh_asmi_3_title'), quality: 'saad', description: t('taleh_asmi_3_desc') },
    { number: 4, title: t('taleh_asmi_4_title'), quality: 'semi-nahs', description: t('taleh_asmi_4_desc') },
    { number: 5, title: t('taleh_asmi_5_title'), quality: 'saad', description: t('taleh_asmi_5_desc') },
    { number: 6, title: t('taleh_asmi_6_title'), quality: 'saad', description: t('taleh_asmi_6_desc') },
    { number: 7, title: t('taleh_asmi_7_title'), quality: 'semi-nahs', description: t('taleh_asmi_7_desc') },
    { number: 8, title: t('taleh_asmi_8_title'), quality: 'swing', description: t('taleh_asmi_8_desc') },
    { number: 9, title: t('taleh_asmi_9_title'), quality: 'swing', description: t('taleh_asmi_9_desc') }
  ], []);

  const dayOfBirthData: { day: string; key: string, planet: string; quality: Quality; description: string }[] = useMemo(() => [
    { day: t('day_saturday'), key: 'saturday', planet: t('planet_saturn'), quality: 'nahs', description: t('day_of_birth_sat_desc') },
    { day: t('day_sunday'), key: 'sunday', planet: t('planet_sun'), quality: 'saad', description: t('day_of_birth_sun_desc') },
    { day: t('day_monday'), key: 'monday', planet: t('planet_moon'), quality: 'saad', description: t('day_of_birth_mon_desc') },
    { day: t('day_tuesday'), key: 'tuesday', planet: t('planet_mars'), quality: 'nahs', description: t('day_of_birth_tue_desc') },
    { day: t('day_wednesday'), key: 'wednesday', planet: t('planet_mercury'), quality: 'semi-nahs', description: t('day_of_birth_wed_desc') },
    { day: t('day_thursday'), key: 'thursday', planet: t('planet_jupiter'), quality: 'saad', description: t('day_of_birth_thu_desc') },
    { day: t('day_friday'), key: 'friday', planet: t('planet_venus'), quality: 'saad', description: t('day_of_birth_fri_desc') }
  ], []);

  const adadRuhiData: { number: number; title: string; quality: Quality; description: string }[] = useMemo(() => [
    { number: 1, title: t('adad_ruhi_1_title'), quality: 'saad', description: t('adad_ruhi_1_desc') },
    { number: 2, title: t('adad_ruhi_2_title'), quality: 'swing', description: t('adad_ruhi_2_desc') },
    { number: 3, title: t('adad_ruhi_3_title'), quality: 'swing', description: t('adad_ruhi_3_desc') },
    { number: 4, title: t('adad_ruhi_4_title'), quality: 'semi-nahs', description: t('adad_ruhi_4_desc') },
    { number: 5, title: t('adad_ruhi_5_title'), quality: 'swing', description: t('adad_ruhi_5_desc') },
    { number: 6, title: t('adad_ruhi_6_title'), quality: 'swing', description: t('adad_ruhi_6_desc') },
    { number: 7, title: t('adad_ruhi_7_title'), quality: 'swing', description: t('adad_ruhi_7_desc') },
    { number: 8, title: t('adad_ruhi_8_title'), quality: 'swing', description: t('adad_ruhi_8_desc') },
    { number: 9, title: t('adad_ruhi_9_title'), quality: 'swing', description: t('adad_ruhi_9_desc') }
  ], []);

  return { talehAsmiData, dayOfBirthData, adadRuhiData };
};
