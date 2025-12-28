
import React from 'react';
import Card from './common/Card';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';

const historyPosts: BlogPost[] = [
    {
        id: 'babylonians',
        icon: '🏛️',
        title: 'بابلیان: اولین اخترشناسان',
        description: 'چگونه بابلیان با رصدهای دقیق خود، الگوهای حرکتی سیارات را ثبت کرده و مفهوم منطقةالبروج (Zodiac) را به جهان معرفی کردند.',
        color: 'border-amber-500/50',
    },
    {
        id: 'greeks',
        icon: '🏺',
        title: 'یونانیان: هندسه و کیهان‌شناسی',
        description: 'انقلاب فلسفی و هندسی یونان که با ارائه مدل زمین‌مرکزی بطلمیوس، برای قرن‌ها بر تفکر نجومی جهان تأثیر گذاشت.',
        color: 'border-sky-500/50',
    },
    {
        id: 'islamic-golden-age',
        icon: '🔭',
        title: 'عصر طلایی اسلام: اوج شکوفایی',
        description: 'دانشمندانی چون خوارزمی و بتانی چگونه با تکمیل آثار یونانی و ابداع ابزارهایی مانند اسطرلاب، پایه‌های نجوم مدرن را بنا نهادند.',
        color: 'border-emerald-500/50',
    },
    {
        id: 'copernican-revolution',
        icon: '🌍',
        title: 'انقلاب کوپرنیکی: تولد نجوم مدرن',
        description: 'ارائه مدل خورشیدمرکزی توسط کوپرنیک و تأیید آن با رصدهای گالیله که درک ما از کیهان را برای همیشه تغییر داد.',
        color: 'border-rose-500/50',
    },
];

const PostCard: React.FC<BlogPost> = ({ id, icon, title, description, color }) => (
    <motion.div 
        className={`bg-slate-800/40 p-6 rounded-xl border-t-4 ${color} h-full flex flex-col group`}
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
    >
        <div className="text-5xl mb-4">{icon}</div>
        <h4 className="font-lalezar text-2xl text-white mb-3">{title}</h4>
        <p className="font-tanha text-gray-300 leading-relaxed flex-grow">{description}</p>
        <a href={`post.html?id=${id}`} className="mt-6 text-indigo-300 font-bold self-start group-hover:text-amber-300 transition-colors">{'ادامه مطلب →'}</a>
    </motion.div>
);

const HistorySection: React.FC = () => {
    return (
        <section id="history" role="region" aria-labelledby="history-title">
            <h3 id="history-title" className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-transparent bg-clip-text">
                {"سفر در تاریخ نجوم"}
            </h3>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
                {"از رصدهای باستانی تا اکتشافات مدرن، داستان کنجکاوی بی‌پایان بشر برای درک جایگاه خود در کیهان."}
            </p>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {historyPosts.map(post => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>
            </Card>
        </section>
    );
};

export default HistorySection;
