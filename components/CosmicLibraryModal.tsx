
import React, { useEffect, useRef } from 'react';
import Card from './common/Card';
import { LibraryChapter } from '../data/cosmicLibraryData';
import { cosmicLibraryData } from '../data/cosmicLibraryData';
import { libraryContent } from '../data/libraryContent';

interface CosmicLibraryModalProps {
  chapter: LibraryChapter;
  onClose: () => void;
}

const chapterTitles: { [key: string]: string } = {
    library_intro_title: "مقدمه",
    library_babylonians_title: "بابلیان",
    library_ancient_civilizations_title: "تمدن‌های باستان",
    library_greeks_title: "یونانیان",
    library_horoscopy_title: "طالع‌بینی و علوم باطنی",
    library_islamic_golden_age_title: "عصر طلایی اسلام",
    library_animal_instincts_title: "غریزه کیهانی حیوانات",
    library_copernican_revolution_title: "انقلاب کوپرنیکی",
    library_modern_astronomy_title: "نجوم مدرن",
    library_financial_astrology_title: 'استراتژی ترید با چرخه‌های ماه',
    library_medical_astrology_title: 'دایره‌المعارف سنگ‌ها و ارتعاشات',
    library_agricultural_astrology_title: 'میراث ستاره‌شناسان باستان',
    library_mundane_astrology_title: 'راهنمای ساعات سعد و نحس',
    library_esoteric_planets_title: 'هندسه مقدس و کدهای ابجد',
};

const CosmicLibraryModal: React.FC<CosmicLibraryModalProps> = ({ chapter, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const mainContent = document.querySelector('#root > div');
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const modalNode = modalRef.current;
    if (modalNode) {
      const focusableElements = modalNode.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (firstElement) firstElement.focus();
      
      const trapFocus = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
        }
      };
      modalNode.addEventListener('keydown', trapFocus);

      return () => {
          document.body.style.overflow = 'auto';
          if (mainContent) mainContent.removeAttribute('aria-hidden');
          window.removeEventListener('keydown', handleKeyDown);
          modalNode.removeEventListener('keydown', trapFocus);
          triggerRef.current?.focus();
      };
    }

    return () => {
      document.body.style.overflow = 'auto';
      if (mainContent) mainContent.removeAttribute('aria-hidden');
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const title = chapterTitles[chapter.titleKey] || chapter.titleKey;
  const content = libraryContent[chapter.contentKey] || chapter.contentKey;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      style={{ animationDuration: '300ms' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-modal-title"
    >
      <div ref={modalRef} className="w-full max-w-4xl">
        <Card className="max-h-[90vh] overflow-y-auto relative !border-indigo-500/50">
          <button 
            onClick={onClose}
            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="بستن"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="text-right">
            <div className="flex items-center mb-8 border-b border-slate-700/50 pb-6">
                <span className="text-7xl ml-6 flex-shrink-0">{chapter.icon}</span>
                <h3 id="library-modal-title" className="text-5xl font-lalezar text-indigo-300">{title}</h3>
            </div>
            
            <div 
                className="prose prose-lg prose-invert max-w-none text-gray-300 prose-p:my-4 prose-headings:text-indigo-400 leading-relaxed font-tanha prose-headings:font-lalezar prose-headings:tracking-wider prose-headings:text-2xl"
                dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CosmicLibraryModal;
