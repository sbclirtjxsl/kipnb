import React from 'react';
import homeImg from '../assets/page_image/Home.webp'; 
import NightImage from '../assets/page_image/HomeNight.webp';
import Header from '../components/Header'; // 헤더 가져오기
import Footer from '../components/Footer'; // 푸터 가져오기

const Home = () => {
  return (
    // 전체 배경과 글자색도 다크모드에 맞춰 부드럽게 변하도록 설정
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      
      <main>
        {/* 2. PEOPLE & BUILDING Section */}
        {/* ⭐ 배경색 다크모드 대응: 낮에는 하늘색, 밤에는 어두운 남색 */}
        <section className="relative overflow-hidden bg-[#D2EBF8] dark:bg-[#1e293b] pt-16 transition-colors duration-300">
          <div className="w-full text-center cursor-default relative z-10 mb-8">
            <h1 className="text-[42px] font-Jua tracking-widest mb-2 text-black dark:text-white transition-colors duration-300">
              PEOPLE & BUILDING
            </h1>
            <p className="text-lg font-Jua tracking-widest text-gray-700 dark:text-gray-400 uppercase transition-colors duration-300">
              incorporated association
            </p>
          </div>
          
          <div className="mx-auto w-full max-w-[1883px]">
            {/* ⭐ 낮 풍경 이미지: 기본으로 보이고, 다크모드에선 숨김 */}
            <img 
              src={homeImg} 
              alt="PEOPLE & BUILDING Buildings (Day)" 
              className="w-full h-auto object-contain object-bottom block dark:hidden" 
            />
            
            {/* ⭐ 밤 풍경 이미지: 기본으로 숨기고, 다크모드에선 보임 */}
            <img 
              src={NightImage} 
              alt="PEOPLE & BUILDING Buildings (Night)" 
              className="w-full h-auto object-contain object-bottom hidden dark:block" 
            />
          </div>
        </section>

        {/* 3. BARRIER FREE Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-[980px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-Jua mb-8 text-black dark:text-white transition-colors duration-300">
              BARRIER FREE
            </h2>
            <p className="text-[15px] leading-loose text-gray-700 dark:text-gray-300 mb-10 text-left md:text-center break-keep transition-colors duration-300">
              배리어 프리(Barrier-Free)란 장애인, 노인, 임산부 등 사회적 약자를 포함한 모든 사람이 일상생활과 사회 활동 전반에서 마주할 수 있는 물리적, 제도적, 심리적, 정보적 장벽들을 제거하여...
            </p>
            <a 
              href="https://www.koddi.or.kr/bf/info/bf.do" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block px-8 py-3 bg-[#317F81] text-white font-bold rounded hover:bg-[#256062] transition-colors"
            >
              Read More
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;