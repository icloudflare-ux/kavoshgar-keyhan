import React, { useState, useCallback } from 'react';
import { generateRamalChart, getFigureInfo, RamalFigureShape, ramalFiguresData } from '../utils/ramal';
import Card from './common/Card';
import FormulaExplanation from './common/FormulaExplanation';

const FigureDisplay: React.FC<{ shape: RamalFigureShape }> = ({ shape }) => (
    <div className="flex flex-col items-center space-y-1.5">
        {shape.map((dot, index) => (
            <div key={index} className="flex space-x-1">
                <span className={`w-2 h-2 rounded-full bg-white`}></span>
                {dot === 0 && <span className={`w-2 h-2 rounded-full bg-white`}></span>}
            </div>
        ))}
    </div>
);

// Hardcoded translations for figures
const figureTranslations: { [key: string]: string } = Object.fromEntries(
    Object.values(ramalFiguresData).map(fig => [fig.translationKey, fig.name])
);

const RamalCalculator: React.FC = () => {
    const [chart, setChart] = useState<RamalFigureShape[] | null>(null);

    const handleCast = useCallback(() => {
        const newChart = generateRamalChart();
        setChart(newChart);
    }, []);

    const houses = Array.from({ length: 16 }, (_, i) => ({
        title: `خانه ${i + 1}`,
        descKey: `ramal_house_${i + 1}_desc`,
    }));

    const houseDescTranslations: { [key: string]: string } = {
        'ramal_house_1_desc': 'نفس و جان سؤال‌کننده', 'ramal_house_2_desc': 'اموال و دارایی', 'ramal_house_3_desc': 'برادران و خواهران', 'ramal_house_4_desc': 'پدر و مادر و املاک',
        'ramal_house_5_desc': 'فرزندان و اخبار', 'ramal_house_6_desc': 'بیماری و خدمتکاران', 'ramal_house_7_desc': 'همسر و شریک', 'ramal_house_8_desc': 'مرگ و میراث',
        'ramal_house_9_desc': 'سفر و علوم غریبه', 'ramal_house_10_desc': 'عزت و مقام', 'ramal_house_11_desc': 'دوستان و امیدها', 'ramal_house_12_desc': 'دشمنان و زندان',
        'ramal_house_13_desc': 'شاهد ماضی (گذشته)', 'ramal_house_14_desc': 'شاهد مستقبل (آینده)', 'ramal_house_15_desc': 'قاضی (داور)', 'ramal_house_16_desc': 'عاقبت کار',
    };

    return (
        <Card>
            <div className="text-center">
                <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"رمل"}</h4>
                <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4">{"رمل یکی از قدیمی‌ترین علوم خفیه برای پیش‌بینی و تحلیل است که بر اساس ۱۶ شکل یا «اشکال» کار می‌کند. با زدن قرعه، یک نمودار کامل (زایچه) برای تحلیل وضعیت فعلی و آینده به دست آورید."}</p>
            </div>

            <div className="text-center my-10">
                <button
                    onClick={handleCast}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 text-2xl font-lalezar tracking-wider shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1"
                >
                    {"زدن قرعه"}
                </button>
            </div>

            {chart && (
                <div className="animate-fade-in">
                    <h3 className="text-3xl font-lalezar text-center mb-8 text-indigo-300">{"زایچه رمل"}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {chart.map((shape, index) => {
                            const info = getFigureInfo(shape);
                            let qualityColor = '';
                            if (info.quality === 'سعد') qualityColor = 'border-green-500';
                            else if (info.quality === 'نحس') qualityColor = 'border-red-500';
                            else qualityColor = 'border-yellow-500';

                            return (
                                <div key={index} className={`bg-slate-800/50 p-4 rounded-lg border-t-4 ${qualityColor} flex flex-col items-center text-center`}>
                                    <span className="font-roboto-mono text-sm text-gray-400 mb-2">خانه {index + 1}</span>
                                    <FigureDisplay shape={shape} />
                                    <span className="font-lalezar text-xl text-white mt-3">{figureTranslations[info.translationKey]}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12">
                        <h3 className="text-3xl font-lalezar text-center mb-8 text-indigo-300">{"تحلیل خانه‌ها"}</h3>
                        <div className="grid md:grid-cols-2 gap-6 font-tanha">
                            {houses.map((house, index) => (
                                <div key={index} className="bg-slate-800/40 p-4 rounded-lg flex items-start gap-4">
                                    <div className="bg-slate-900/70 text-indigo-300 font-bold rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center font-roboto-mono text-lg">{index + 1}</div>
                                    <div>
                                        <h5 className="font-bold text-lg text-gray-100">{house.title}</h5>
                                        <p className="text-gray-400">{houseDescTranslations[house.descKey]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
            
            <FormulaExplanation title={"روش تکسیر"}>
                <p>{"این زایچه بر اساس روش «تکسیر» ساخته می‌شود:"}</p>
                <ol>
                    <li><strong>{"امهات (مادران):"}</strong> {"چهار شکل اول به صورت تصادفی (قرعه) ایجاد می‌شوند."}</li>
                    <li><strong>{"بنات (دختران):"}</strong> {"چهار شکل بعدی از کنار هم قرار دادن سطرهای مادران به دست می‌آیند."}</li>
                    <li><strong>{"حفیدات (نوادگان):"}</strong> {"اشکال بعدی از ترکیب دوتایی اشکال قبلی ساخته می‌شوند."}</li>
                    <li><strong>{"قاضی و عاقبت:"}</strong> {"اشکال نهایی نیز از ترکیب اشکال ماقبل خود به دست می‌آیند تا زایچه کامل شود."}</li>
                </ol>
            </FormulaExplanation>

        </Card>
    );
};

export default RamalCalculator;
