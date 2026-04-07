import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 이미지 파일들이 assets 폴더에 있다고 가정합니다.
// 실제 경로에 맞게 수정해주세요.
import GreetingMainImg from '../assets/page_image/greeting.webp'; // 사진1의 건물 이미지
import LogoMolit from '../assets/logos/MOLIT_logo.webp';         // 국토교통부 로고
import LogoChungnam from '../assets/logos/Chungnam.webp';   // 충청남도 로고

const AA__Greeting = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main>
        {/* 1. 서브 페이지 헤더 (타이틀 영역) - 사진 1 스타일로 슬림하게 수정 */}
        <section className="py-12"> {/* 배경색 제거, 패딩 축소 */}
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">인사말</h2>
            
            {/* 브레드크럼 디자인 수정: separator 제거, 색상 통일 */}
            <div className="text-sm text-gray-500 flex justify-center gap-1">
              <span>사람과건축 소개</span>
              <span>&gt;</span>
              <span className="text-gray-500">인사말</span> {/* 색상 강조 제거 */}
            </div>
          </div>
        </section>

        {/* 2. 본문 영역 - 세로 1단 구조로 전면 수정 */}
        <section className="pb-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* [추가] 상단 메인 이미지 영역 (사진 1처럼 와이드하게) */}
            <div className="w-full h-[450px] md:h-[150px] mb-12 rounded-lg overflow-hidden shadow-md">
              <img 
                src={GreetingMainImg} 
                alt="사람과건축 전경" 
                className="w-full h-auto object-cover aspect-[21/9]" // 와이드 비율 유지
              />
              {/* 이미지가 없을 때를 위한 fallback (개발용) */}
              {/* <div className="aspect-[21/9] bg-gray-200 flex items-center justify-center text-gray-400">메인 이미지 준비중</div> */}
            </div>

            {/* 텍스트 영역: 기존 flex 구조 제거, break-keep 적용으로 한글 가독성 향상 */}
            <div className="space-y-8 text-[16px] leading-relaxed text-gray-700 break-keep text-justify">
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

            {/* [추가] 하단 유관기관 로고 영역 */}
            <div className="mt-16 pt-10 border-t border-gray-100 flex justify-center items-center gap-10">
              <img src={LogoMolit} alt="국토교통부" className="h-10 w-auto opacity-90" />
              <img src={LogoChungnam} alt="충청남도" className="h-10 w-auto opacity-90" />
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AA__Greeting;