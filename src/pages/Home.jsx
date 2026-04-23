import React from 'react';
import homeImg from '../assets/page_image/Home.webp'; 
import NightImage from '../assets/page_image/HomeNight.webp';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300">
      <Header />
      
      <main>
        {/* 🌟 수정 1: 하드코딩된 배경색 제거! App.css의 변수(bg-bg-hero)를 사용합니다. */}
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
            {/* 🌟 수정 2: App.css의 변수를 사용하여 낮/밤 이미지를 강제 제어합니다. */}
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

        {/* 3. BARRIER FREE Section */}
        <section className="py-20 bg-bg-surface transition-colors duration-300">
          <div className="max-w-[980px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-Jua mb-8 text-txt-primary transition-colors duration-300">
              BARRIER FREE
            </h2>
            <p className="text-[15px] leading-loose text-txt-secondary mb-10 text-left md:text-center break-keep transition-colors duration-300">
              배리어 프리(Barrier-Free)란 장애인, 노인, 임산부 등 사회적 약자를 포함한 모든 사람이 일상생활과 사회 활동 전반에서 마주할 수 있는 물리적, 제도적, 심리적, 정보적 장벽들을 제거하여...
            </p>
            <a 
              href="https://www.koddi.or.kr/bf/info/bf.do" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block px-8 py-3 bg-brand-main text-txt-inverse font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-brand-dark hover:-translate-y-0.5 transition-all duration-300"
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