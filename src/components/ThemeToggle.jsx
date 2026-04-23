import React, { useState, useEffect, useRef } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('system'); 
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 1. 초기 로드 시 로컬 스토리지에서 설정 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  // 2. 테마가 변경될 때마다 HTML 태그에 dark 클래스 제어
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme) => {
      if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else if (currentTheme === 'light') {
        root.classList.remove('dark');
      } else {
        // System 설정일 경우 OS 설정 확인
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // System 설정일 때 OS 테마 실시간 변경 감지
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // 3. 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 현재 테마에 따른 메인 버튼 아이콘
  const getCurrentIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '🌇';
  };

  return (
    <div ref={dropdownRef} className="fixed bottom-6 right-6 z-[100]">
      {/* 팝업 메뉴 */}
      <div 
        className={`absolute bottom-16 right-0 mb-2 w-36 bg-bg-surface border border-bd-subtle rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col p-1">
          <button 
            onClick={() => { setTheme('light'); setIsOpen(false); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-brand-light text-brand-main' : 'text-txt-secondary hover:bg-bg-surface-hover hover:text-txt-primary'}`}
          >
            <span>☀️</span> 라이트
          </button>
          <button 
            onClick={() => { setTheme('dark'); setIsOpen(false); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-brand-light text-brand-main' : 'text-txt-secondary hover:bg-bg-surface-hover hover:text-txt-primary'}`}
          >
            <span>🌙</span> 다크
          </button>
          <button 
            onClick={() => { setTheme('system'); setIsOpen(false); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === 'system' ? 'bg-brand-light text-brand-main' : 'text-txt-secondary hover:bg-bg-surface-hover hover:text-txt-primary'}`}
          >
            <span>🌇</span> 시스템
          </button>
        </div>
      </div>

      {/* 메인 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-bg-surface border border-bd-subtle text-2xl flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:border-brand-main hover:-translate-y-1 transition-all duration-300"
        aria-label="테마 변경"
      >
        {getCurrentIcon()}
      </button>
    </div>
  );
};

export default ThemeToggle;