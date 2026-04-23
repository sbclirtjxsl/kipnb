import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoImg from '../assets/logos/Logo.webp';

const Soon = () => {
  const navigate = useNavigate();

  return (
    /* 1. 전체 배경 및 기본 텍스트 색상 연동 */
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-[600px] w-full mx-auto px-4 text-center">
          
          {/* 메인 문구 */}
          <h2 className="text-3xl font-bold text-txt-primary mb-6 tracking-tight  py-10">
            서비스 준비 중입니다
          </h2>

          {/* 아이콘/로고 영역: bg-white 대신 bg-bg-surface 사용, 다크모드 로고 반전 처리 */}
          <div className="mb-10 inline-block p-6 bg-bg-card rounded-full shadow-sm transition-colors">
            <img 
              src={LogoImg} 
              alt="사람과건축 로고" 
              className="h-12 w-auto dark:invert transition-all" 
            />
          </div>

          {/* 안내 문구: 가독성을 위해 text-txt-secondary 적용 */}
          <div className="space-y-2 mb-12 text-lg text-txt-secondary break-keep leading-relaxed">
            <p>방문해 주셔서 감사합니다.</p>
            <p>보다 나은 서비스를 제공하기 위해 현재 페이지를 준비하고 있습니다.</p>
            <p>빠른 시일 내에 찾아뵙겠습니다.</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-bold">
            {/* 보조 버튼 (이전으로) */}
            <button 
              onClick={() => navigate(-1)} 
              className="px-8 py-3 border border-bd-default text-txt-primary rounded-md hover:bg-bg-surface-hover transition-colors"
            >
              이전으로
            </button>
            {/* 메인 버튼 (홈으로 가기) - 브랜드 컬러 연동 */}
            <button 
              onClick={() => navigate('/')} 
              className="px-8 py-3 bg-brand-main text-txt-inverse rounded-md hover:bg-brand-dark transition-colors shadow-md"
            >
              홈으로 가기
            </button>
          </div>

          {/* 하단 안내 라인 */}
          <div className="mt-16 pt-8 border-t border-bd-default">
            <p className="text-sm text-txt-muted">
              관련 문의사항은 <span className="text-txt-primary font-medium">041-900-4980</span>으로 연락 주시기 바랍니다.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Soon;