import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoImg from '../assets/logos/Logo.webp';

const Soon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-main font-sans txt-main flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-main py-20">
        <div className="max-w-[600px] w-full mx-auto px-4 text-center">
          
          {/* 아이콘/로고 영역 */}
          <div className="mb-10 inline-block p-6 bg-white rounded-full shadow-sm border border-gray-100">
            <img src={LogoImg} alt="사람과건축 로고" className="h-12 w-auto opacity-50 grayscale" />
          </div>

          {/* 메인 문구 */}
          <h2 className="text-4xl font-bold txt-main mb-6 tracking-tight">
            서비스 준비 중입니다
          </h2>
          
          <div className="space-y-2 mb-12 text-lg txt-main break-keep leading-relaxed">
            <p>방문해 주셔서 감사합니다.</p>
            <p>보다 나은 서비스를 제공하기 위해 현재 페이지를 준비하고 있습니다.</p>
            <p>빠른 시일 내에 찾아뵙겠습니다.</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-bold">
            <button 
              onClick={() => navigate(-1)} // 이전 페이지로 이동
              className="px-8 py-3 border border-gray-300 txt-main rounded-md hover:bg-gray-100 transition-colors"
            >
              이전으로
            </button>
            <button 
              onClick={() => navigate('/')} // 홈으로 이동
              className="px-8 py-3 bg-main txt-main rounded-md hover:bg-[#256062] transition-all shadow-md"
            >
              홈으로 가기
            </button>
          </div>

          {/* 하단 안내 라인 */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm txt-main">
              관련 문의사항은 <span className="txt-main font-medium">041-900-4980</span>으로 연락 주시기 바랍니다.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Soon;