import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// assets 폴더의 SVG 파일 임포트
import BFFee1 from '../assets/BF_Fee1.svg';
import BFFee2 from '../assets/BF_Fee2.svg';
import BFFee3 from '../assets/BF_Fee3.svg';

// 📂 추가됨: PDF 파일 임포트 (경로: src/assets/file/파일명)
import BFFeePdf from '../assets/file/[별표 8] 장애물 없는 생활환경 인증 수수료(제4조 관련).pdf';

const BF_Fee = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300 flex flex-col">
      <Header />

      <main className="flex-grow">
        
        {/* 타이틀 영역 */}
        <section className="pt-12 pb-6">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-extrabold text-txt-primary tracking-tight">
              인증 수수료
            </h2>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="pb-24">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            
            {/* 1. 지역 및 개별시설 인증 수수료 표 */}
            <div className="mb-14">
              <h3 className="text-[16px] md:text-[17px] text-txt-primary mb-4 break-keep font-medium">
                지역 및 개별시설(공원, 교통수단, 여객시설, 도로) 인증
              </h3>
              <div className="w-full overflow-x-auto">
                <img 
                  src={BFFee1} 
                  alt="지역 및 개별시설 인증 수수료" 
                  className="w-full min-w-[700px] h-auto object-contain auto-invert" 
                />
              </div>
            </div>

            {/* 2. 개별시설 인증 수수료 표 */}
            <div className="mb-14">
              <h3 className="text-[16px] md:text-[17px] text-txt-primary mb-4 break-keep font-medium">
                개별시설(공공건축물 및 공중이용시설, 공동주택, 통신시설 등) 인증
              </h3>
              <div className="w-full overflow-x-auto">
                <img 
                  src={BFFee2} 
                  alt="개별시설 인증 수수료" 
                  className="w-full min-w-[700px] h-auto object-contain auto-invert" 
                />
              </div>
            </div>

            {/* 3. 수수료 기준 안내 박스 및 첨부파일 링크 */}
            <div>
              <div className="w-full overflow-x-auto mb-4">
                <img 
                  src={BFFee3} 
                  alt="인증심사기준 및 수수료기준 규정" 
                  className="w-full min-w-[700px] h-auto object-contain auto-invert" 
                />
              </div>
              
              {/* 우측 하단 첨부파일 링크 */}
              <div className="text-right">
                {/* ✨ 수정됨: href에 임포트한 BFFeePdf 변수를 넣고, 다운로드가 가능하도록 download 속성과 새창열기 속성을 추가했습니다. */}
                <a 
                  href={BFFeePdf} 
                  download="[별표 8] 장애물 없는 생활환경 인증 수수료(제4조 관련).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-brand-main hover:text-brand-dark hover:underline text-[14px] md:text-[15px] transition-colors"
                >
                  첨부파일 : [별표 8] 장애물 없는 생활환경 인증 수수료(제4조 관련).pdf
                </a>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BF_Fee;