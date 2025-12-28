import React, { useState, useCallback } from 'react';
import { generateMusallas, generateMurabba, generateMukhammas, verifyOfagh, VerificationResult } from '../utils/ofagh';
import Card from './common/Card';
import FormulaExplanation from './common/FormulaExplanation';

type Mode = 'generate' | 'verify';

const OfaghCalculator: React.FC = () => {
    const [mode, setMode] = useState<Mode>('generate');

    // State for generation
    const [baseNumber, setBaseNumber] = useState('');
    const [size, setSize] = useState<3 | 4 | 5>(3);
    const [generatedSquare, setGeneratedSquare] = useState<number[][] | null>(null);
    const [generationError, setGenerationError] = useState('');

    // State for verification
    const [verifySize, setVerifySize] = useState(3);
    const [verifyGrid, setVerifyGrid] = useState<(number | null)[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

    const handleGenerate = useCallback(() => {
        const num = parseInt(baseNumber);
        if (isNaN(num) || num <= 0) {
            setGenerationError('لطفاً یک عدد صحیح و مثبت وارد کنید.');
            setGeneratedSquare(null);
            return;
        }

        setGenerationError('');
        let square: number[][] | null = null;
        if (size === 3) square = generateMusallas(num);
        else if (size === 4) square = generateMurabba(num);
        else if (size === 5) square = generateMukhammas(num);

        if (square) {
            setGeneratedSquare(square);
        } else {
            setGenerationError(`عدد وارد شده برای ساخت وفق ${size}x${size} مناسب نیست.`);
            setGeneratedSquare(null);
        }
    }, [baseNumber, size]);

    const handleVerifyGridChange = (row: number, col: number, value: string) => {
        const newGrid = verifyGrid.map(r => [...r]);
        const intValue = parseInt(value, 10);
        newGrid[row][col] = value === '' || isNaN(intValue) ? null : intValue;
        setVerifyGrid(newGrid);
        setVerificationResult(null);
    };
    
    const handleVerifySizeChange = (newSize: number) => {
        setVerifySize(newSize);
        setVerifyGrid(Array(newSize).fill(null).map(() => Array(newSize).fill(null)));
        setVerificationResult(null);
    };

    const handleVerify = () => {
        setVerificationResult(verifyOfagh(verifyGrid));
    };
    
    const renderSquare = (square: number[][]) => (
        <table className="mx-auto border-collapse">
            <tbody>
                {square.map((row, rIndex) => (
                    <tr key={rIndex}>
                        {row.map((cell, cIndex) => (
                            <td key={cIndex} className="border border-slate-600 w-20 h-20 text-center text-3xl font-roboto-mono text-white">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderVerifyGrid = () => (
        <table className="mx-auto border-collapse">
            <tbody>
                {verifyGrid.map((row, rIndex) => (
                    <tr key={rIndex}>
                        {row.map((cell, cIndex) => (
                            <td key={cIndex} className="border border-slate-600 p-0">
                                <input
                                    type="number"
                                    value={cell === null ? '' : String(cell)}
                                    onChange={(e) => handleVerifyGridChange(rIndex, cIndex, e.target.value)}
                                    className="w-20 h-20 text-center text-3xl font-roboto-mono bg-slate-800/50 text-white outline-none focus:bg-slate-700/50"
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const ModeButton: React.FC<{ targetMode: Mode, label: string }> = ({ targetMode, label }) => (
        <button
            onClick={() => setMode(targetMode)}
            className={`w-1/2 py-3 text-center rounded-md transition-all duration-300 font-semibold text-lg ${mode === targetMode ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-slate-700/50'}`}
        >
            {label}
        </button>
    );

    return (
        <Card>
            <div className="text-center">
                <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"محاسبه‌گر اوفاق"}</h4>
                <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4">{"اوفاق یا مربع‌های جادویی، جداولی هستند که مجموع اعداد در هر سطر، ستون و قطر آن‌ها یکسان است. این ابزار به شما امکان ساخت یا بررسی این جداول را می‌دهد."}</p>
            </div>
            
            <div className="flex justify-center bg-slate-900/50 rounded-lg p-1.5 border border-slate-700 max-w-sm mx-auto my-8">
                <ModeButton targetMode="generate" label={"ساختن"} />
                <ModeButton targetMode="verify" label={"بررسی"} />
            </div>

            {mode === 'generate' && (
                <div className="animate-fade-in">
                    <div className="max-w-md mx-auto space-y-4">
                         <div>
                            <label className="block text-lg font-tanha text-gray-300 mb-2">{"عدد پایه (مجموع)"}</label>
                            <input type="number" value={baseNumber} onChange={e => setBaseNumber(e.target.value)} placeholder={"عدد مورد نظر را وارد کنید"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3"/>
                         </div>
                         <div>
                            <label className="block text-lg font-tanha text-gray-300 mb-2">{"اندازه جدول"}</label>
                            <select value={size} onChange={e => setSize(Number(e.target.value) as 3|4|5)} className="w-full bg-slate-800/50 border-slate-600 rounded p-3">
                                <option value={3}>{"3x3 (مثلث)"}</option>
                                <option value={4}>{"4x4 (مربع)"}</option>
                                <option value={5}>{"5x5 (مخمس)"}</option>
                            </select>
                         </div>
                         <button onClick={handleGenerate} disabled={!baseNumber} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg">{"ساختن وفق"}</button>
                    </div>
                    {generationError && <p className="text-red-400 text-center font-tanha mt-4">{generationError}</p>}
                    {generatedSquare && (
                        <div className="mt-10 text-center">
                            {renderSquare(generatedSquare)}
                            <p className="mt-4 font-tanha text-lg">{"مجموع جادویی"}: <span className="font-roboto-mono font-bold text-amber-400">{baseNumber}</span></p>
                        </div>
                    )}
                </div>
            )}
            
            {mode === 'verify' && (
                <div className="animate-fade-in">
                    <div className="max-w-lg mx-auto space-y-6">
                        <div className="text-center">
                             <label className="block text-lg font-tanha text-gray-300 mb-2">{"اندازه جدول"}</label>
                             <select value={verifySize} onChange={e => handleVerifySizeChange(Number(e.target.value))} className="w-full max-w-xs mx-auto bg-slate-800/50 border-slate-600 rounded p-3">
                                <option value={3}>3x3</option>
                                <option value={4}>4x4</option>
                                <option value={5}>5x5</option>
                             </select>
                        </div>
                        {renderVerifyGrid()}
                        <button onClick={handleVerify} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg">{"بررسی صحت"}</button>
                        {verificationResult && (
                            <div className={`p-4 rounded-lg text-center font-tanha text-lg ${verificationResult.isValid ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                                {verificationResult.isValid ? (
                                    <p>✅ {"جدول صحیح است."} {"مجموع جادویی"}: <strong className="font-roboto-mono">{verificationResult.magicConstant}</strong></p>
                                ) : (
                                    <div>
                                        <p>❌ {"جدول صحیح نیست."}</p>
                                        <ul className="text-sm mt-2 text-left space-y-1">
                                            {verificationResult.mismatches.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
             <FormulaExplanation title={"الگوریتم‌های ساخت"}>
                <p>{"هر وفق بر اساس یک الگوریتم ریاضی خاص ساخته می‌شود:"}</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>{"3x3 (مثلث)"}:</strong> {"(عدد پایه - ۳۰) / ۳. عدد حاصل به عنوان «کسر» برای پیدا کردن عدد کلید استفاده می‌شود."}</li>
                    <li><strong>{"4x4 (مربع)"}:</strong> {"(عدد پایه - ۱۳۰) / ۴. عدد کلید به دست آمده در یک الگوی خاص در جدول قرار می‌گیرد."}</li>
                    <li><strong>{"5x5 (مخمس)"}:</strong> {"(عدد پایه - ۳۲۵) / ۵. با استفاده از روش سیامی (حرکت اسب) اعداد در جدول پر می‌شوند."}</li>
                </ul>
            </FormulaExplanation>
        </Card>
    );
};

export default OfaghCalculator;
