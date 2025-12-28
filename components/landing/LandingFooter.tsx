
import React from 'react';

const SocialLink: React.FC<{ href: string; ariaLabel: string; children: React.ReactNode }> = ({ href, ariaLabel, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="text-gray-500 hover:text-white transition-transform duration-300 transform hover:scale-110"
  >
    {children}
  </a>
);

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-black/30 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400">
        <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse mb-6">
            <SocialLink href="mailto:cloudflarei388@gmail.com" ariaLabel="ایمیل">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </SocialLink>
            <SocialLink href="https://t.me/icloudflare" ariaLabel="تلگرام">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.57c-.28 1.1-.86 1.32-1.74.84l-4.9-3.57l-2.38 2.31c-.26.26-.49.5-.92.5z"/></svg>
            </SocialLink>
            <SocialLink href="https://instagram.com/_king_yahoo" ariaLabel="اینستاگرام">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.161 0-3.522.012-4.755.068-2.912.132-4.11 1.31-4.243 4.243C3.012 9.277 3 9.638 3 12.001s.012 2.724.068 3.957c.133 2.933 1.33 4.11 4.243 4.243 1.233.056 1.594.068 4.755.068s3.522-.012 4.755-.068c2.912-.133 4.11-1.31 4.243-4.243.056-1.233.068-1.594.068-3.957s-.012-2.724-.068-3.957c-.133-2.933-1.33-4.11-4.243-4.243-1.233-.056-1.594-.068-4.755-.068zM12 6.837a5.163 5.163 0 100 10.326 5.163 5.163 0 000-10.326zm0 8.441a3.278 3.278 0 110-6.556 3.278 3.278 0 010 6.556zm4.965-8.402a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/></svg>
            </SocialLink>
        </div>
        <div className="border-t border-slate-700/50 pt-6">
          <p>&copy; {new Date().getFullYear()} کاوشگر کیهان. تمامی حقوق محفوظ است.</p>
          <p className="text-sm mt-2">طراح: <span className="font-semibold text-indigo-400">مهندس مرتضی حق وردی</span></p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
