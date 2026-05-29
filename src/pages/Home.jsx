import React, { useEffect, useRef, useState } from 'react';
import homeImg from '../assets/page_image/Home.webp'; 
import NightImage from '../assets/page_image/HomeNight.webp';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const Home = () => {
  const [isBarsVisible, setIsBarsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBarsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300">
      <Header />
      
      <main>
        {/* 1. 메인 히어로 섹션 */}
        <section className="relative overflow-hidden bg-bg-hero pt-16 transition-colors duration-300">
          <div className="w-full text-center cursor-default relative z-10 mb-8">
            <h1 className="text-[42px] font-Jua tracking-widest mb-2 text-txt-primary transition-colors duration-300">
              PEOPLE & BUILDING
            </h1>
            <p className="text-lg font-Jua tracking-widest text-txt-secondary uppercase transition-colors duration-300">
              incorporated association
            </p>
          </div>
          
          <div className="mx-auto w-full max-w-[1883px]">
            <img 
              src={homeImg} 
              alt="Day View" 
              style={{ display: 'var(--display-day)' }}
              className="w-full h-auto object-contain object-bottom" 
            />
            <img 
              src={NightImage} 
              alt="Night View" 
              style={{ display: 'var(--display-night)' }}
              className="w-full h-auto object-contain object-bottom" 
            />
          </div>
        </section>

        {/* 2. BARRIER FREE Section */}
        <section 
          ref={sectionRef} 
          className="py-20 md:py-32 bg-bg-surface transition-colors duration-300 relative overflow-hidden flex items-center min-h-[500px]"
        >
          {/* 우측: 애니메이션 색상 막대 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] md:w-[50%] lg:w-[45%] flex flex-col items-end gap-4 md:gap-6 z-0 pointer-events-none">
            <div 
              className={`h-12 md:h-20 lg:h-24 w-full bg-gradient-to-r from-[#fbb635] to-[#f47f20] rounded-l-full shadow-lg transition-all duration-[1000ms] ease-out delay-[0ms] ${
                isBarsVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            />
            <div 
              className={`h-12 md:h-20 lg:h-24 w-[85%] bg-gradient-to-r from-[#f5ecd8] to-[#e4d2b2] rounded-l-full shadow-lg transition-all duration-[1000ms] ease-out delay-[150ms] ${
                isBarsVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            />
            <div 
              className={`h-12 md:h-20 lg:h-24 w-[95%] bg-gradient-to-r from-[#ef4643] to-[#d32f2f] rounded-l-full shadow-lg transition-all duration-[1000ms] ease-out delay-[300ms] ${
                isBarsVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            />
            <div 
              className={`h-12 md:h-20 lg:h-24 w-[75%] bg-gradient-to-r from-[#ffc82a] to-[#fca000] rounded-l-full shadow-lg transition-all duration-[1000ms] ease-out delay-[450ms] ${
                isBarsVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            />
          </div>

          {/* ⭐ 좌측: 텍스트 콘텐츠 (헤더 로고와 정렬을 맞추기 위해 컨테이너 너비와 좌측 여백 대폭 증가) */}
          <div className="max-w-[1200px] w-full mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row">
            <div className="md:w-[65%] lg:w-[60%] xl:w-[55%] text-left bg-bg-surface/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-6 md:p-0 md:pl-12 lg:pl-24 xl:pl-32 rounded-2xl">
              <h2 className="text-4xl md:text-5xl font-Jua mb-8 text-txt-primary transition-colors duration-300">
                BARRIER FREE
              </h2>
              <p className="text-[15px] leading-loose text-txt-secondary mb-10 break-keep transition-colors duration-300 pr-0 md:pr-10">
                배리어 프리(Barrier-Free)란 장애인, 노인, 임산부 등 사회적 약자를 포함한 모든 사람이 일상생활과 사회 활동 전반에서 마주할 수 있는 물리적, 제도적, 심리적, 정보적 장벽들을 제거하여, 누구에게나 차별 없이 동등한 기회와 편리한 생활을 보장하는 포용적인 환경 조성을 의미합니다. 이는 단순히 시설 개선을 넘어 정보 접근성, 문화 향유 기회 확대, 사회적 인식 개선까지 포괄하며, 궁극적으로 모든 구성원의 존엄성을 지키고 삶의 질을 향상시켜 더불어 함께하는 사회를 실현하는 데 그 목적이 있습니다.
              </p>
              <a 
                href="https://www.koddi.or.kr/bf/info/bf.do" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Read More
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;