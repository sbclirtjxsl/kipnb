import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../App.css';
import GreetingMainImg from '../assets/page_image/greeting.webp'; 
import LogoMolit from '../assets/logos/MOLIT_logo.webp';        
import LogoChungnam from '../assets/logos/Chungnam.webp';   

const AA__Greeting = () => {
  return (
    /* 1. 전체 배경 및 기본 텍스트 색상 연동 */
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300">
      <Header />

      <main>
        {/* 서브 페이지 헤더 (타이틀 영역) */}
        <section className="py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-3 text-txt-primary">인사말</h2>
            
            {/* 브레드크럼: 지나온 경로는 text-txt-muted, 현재 페이지는 포인트 컬러(brand-main) 사용 */}
            <div className="text-sm text-txt-muted flex justify-center items-center gap-2">
              <span>사람과건축 소개</span>
              <span className="text-[10px] opacity-50">&gt;</span>
              <span className="font-bold text-brand-main">인사말</span> 
            </div>
          </div>
        </section>

        {/* 본문 영역 */}
        <section className="pb-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 상단 메인 이미지 영역 */}
            <div className="w-full h-[150px] md:h-[300px] mb-12 rounded-xl overflow-hidden shadow-sm border border-bd-subtle">
              <img 
                src={GreetingMainImg} 
                alt="사람과건축 전경" 
                className="w-full h-full object-cover aspect-[21/9] transition-opacity duration-300 dark:opacity-90" 
              />
            </div>

            {/* 텍스트 영역: 긴 본문은 눈이 편안한 text-txt-secondary 사용 */}
            <div className="space-y-6 text-[16px] md:text-[17px] leading-loose text-txt-secondary break-keep text-justify">
              <p>
                우리는 현재 기후 변화와 자원 고갈, 도시화 등의 문제로 인해 건축 환경이 도전받고 있는 상황에 직면해 있습니다. 
                이러한 문제들은 건축물의 안전성, 쾌적성, 경제성 등에 영향을 미치며, 인류의 생존과 발전에 위협이 되고 있습니다.
              </p>
              <p>
                이에 사단법인 사람과 건축은 공공건축물의 지속 가능한 건축, 장애물 없는 생활환경과 관련된 각종 현안에 대하여 조사·연구의 수행, 
                관련 정보와 자료의 축적, 건설 산업 현장에의 관련 기술 적용 및 인증, 간행물 발간 등의 활동을 통하여, 
                지속 가능한 건축과 장애물 없는 생활환경에 대한 올바른 방향과 정책대안을 제시함으로써 사용자의 삶의 질을 향상 시키고 
                기후변화와 탄소 문제를 해결하는데 기여하고자 합니다.
              </p>
            </div>

            {/* 하단 유관기관 로고 영역 */}
            <div className="mt-16 pt-8 border-t border-bd-default flex justify-center items-center gap-8 md:gap-12">
              {/* 로고 이미지가 검은색 글씨 기반이라면 다크모드에서 안 보일 수 있으므로 dark:invert 적용 */}
              <img 
                src={LogoMolit} 
                alt="국토교통부" 
                className="h-10 md:h-12 w-auto opacity-80 hover:opacity-100 transition-all " 
              />
              <img 
                src={LogoChungnam} 
                alt="충청남도" 
                className="h-10 md:h-12 w-auto opacity-80 hover:opacity-100 transition-all " 
              />
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AA__Greeting;