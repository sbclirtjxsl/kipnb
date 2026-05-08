import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../App.css';
import GreetingMainImg from '../assets/page_image/greeting.webp'; 
import LogoMolit from '../assets/logos/MOLIT_logo.webp';        
import LogoChungnam from '../assets/logos/Chungnam.webp';   

const AA__Greeting = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* 상단 타이틀 및 배너 영역 (Notice.jsx와 완벽히 동일한 구조 및 스타일) */}
        <section className="max-w-[900px] mx-auto pt-10 pb-4 px-4 text-center">
          <h2 className="text-3xl font-extrabold text-txt-primary mb-4 tracking-tight">
            인사말
          </h2>
          
          {/* 브레드크럼 (Notice의 설명 텍스트 위치 및 여백과 동일하게 맞춤) */}
          <div className="text-sm text-txt-muted flex justify-center items-center gap-2 mb-4 font-medium">
            <span>사람과건축 소개</span>
            <span className="text-[10px] opacity-50">&gt;</span>
            <span className="font-bold text-brand-main">인사말</span> 
          </div>

          {/* 메인 이미지 (Notice.jsx와 동일하게 높이 180px, 둥근 모서리 rounded-3xl 적용) */}
          <div className="w-full h-[180px] rounded-3xl overflow-hidden shadow-sm">
            <img 
              src={GreetingMainImg} 
              alt="사람과건축 전경" 
              className="w-full h-full object-cover dark:opacity-90" 
            />
          </div>
        </section>

        {/* 본문 영역 */}
        <section className="py-6 pb-16">
          <div className="max-w-[900px] mx-auto px-4">
            
            {/* 텍스트 영역 */}
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
              <img 
                src={LogoMolit} 
                alt="국토교통부" 
                className="h-10 md:h-12 w-auto opacity-80 hover:opacity-100 transition-all" 
              />
              <img 
                src={LogoChungnam} 
                alt="충청남도" 
                className="h-10 md:h-12 w-auto opacity-80 hover:opacity-100 transition-all" 
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