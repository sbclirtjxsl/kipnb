import React from 'react';
import homeImg from '../assets/Home.png'; 
import Header from '../components/Header'; // 헤더 가져오기
import Footer from '../components/Footer'; // 푸터 가져오기

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />
      
      <main>
        {/* 2. PEOPLE & BUILDING Section */}
        <section className="relative overflow-hidden bg-[#D2EBF8] pt-16">
          <div className="w-full text-center cursor-default relative z-10 mb-8">
            <h1 className="text-[42px] font-bold tracking-widest mb-2 text-black font-serif">PEOPLE & BUILDING</h1>
            <p className="text-lg font-normal tracking-widest text-gray-700 uppercase">incorporated association</p>
          </div>
          <div className="mx-auto w-full max-w-[1883px]">
            <img 
              src={homeImg} 
              alt="PEOPLE & BUILDING Buildings" 
              className="w-full h-auto object-contain object-bottom block" 
            />
          </div>
        </section>

        {/* 3. BARRIER FREE Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[980px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">BARRIER FREE</h2>
            <p className="text-[15px] leading-loose text-gray-700 mb-10 text-left md:text-center break-keep">
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

        {/* 4. LOCATION Section
        <section className="py-20">
          <div className="max-w-[980px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-700 mb-8 tracking-tighter">LOCATION</h2>
            <div className="mb-10">
              <a 
                href="https://map.naver.com/p/search/%EC%B2%AD%EC%88%985%EB%A1%9C%209/address/14154768.2921403,4408962.7689035" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-3 bg-[#317F81] text-white font-bold rounded-full hover:bg-[#256062] transition-colors shadow-lg"
              >
                네이버 지도
              </a>
            </div>
            <div className="w-full max-w-[632px] h-[446px] mx-auto bg-gray-200 border rounded-lg overflow-hidden flex items-center justify-center shadow-md">
              <span className="text-gray-500">지도 표시 영역</span>
            </div>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
};

export default Home;