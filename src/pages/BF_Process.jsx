import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 💡 assets 폴더에 있는 SVG 파일들을 불러옵니다.
import BFProcess1 from '../assets/BF_Process1.svg';
import BFProcess2 from '../assets/BF_Process2.svg';

const BF_Process = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300 flex flex-col">
      <Header />

      <main className="flex-grow">
        
        {/* 타이틀 영역 */}
        <section className="pt-12 pb-6">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-extrabold text-txt-primary tracking-tight">
              종류 및 절차
            </h2>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="pb-24">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            
            {/* 1. 예비인증 박스 */}
            {/* ✨ 수정됨: 테두리(border), 그림자(shadow), 여백(padding)을 모두 제거하여 평면적인 문서 스타일로 변경 */}
            <div className="mb-16">
              
              {/* 박스 타이틀 */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-5 h-5 bg-[#eb5a5a] rounded-sm"></div>
                <h3 className="text-[22px] md:text-[24px] font-bold text-txt-primary tracking-tight">예비인증</h3>
              </div>
              
              {/* 신청시기 */}
              <div className="mb-10 pl-1 md:pl-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-[#facc15] rounded-full"></div>
                  <h4 className="text-[17px] font-bold text-txt-primary">신청시기</h4>
                </div>
                <ul className="pl-6 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary break-keep">
                  <li>- 개별시설 또는 지역</li>
                  <li>- 설계에 반영된 내용을 대상으로 본인증 신청 전</li>
                </ul>
              </div>

              {/* 인증절차 (SVG 도표) */}
              <div className="pl-1 md:pl-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-[#facc15] rounded-full"></div>
                  <h4 className="text-[17px] font-bold text-txt-primary">인증절차</h4>
                </div>
                <div className="w-full overflow-x-auto">
                  <img 
                    src={BFProcess1} 
                    alt="예비인증 절차 도표" 
                    className="w-full min-w-[700px] h-auto object-contain auto-invert" 
                  />
                </div>
              </div>
            </div>

            {/* 2. 본인증 박스 */}
            {/* ✨ 수정됨: 테두리(border), 그림자(shadow), 여백(padding) 제거 */}
            <div>
              
              {/* 박스 타이틀 */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-5 h-5 bg-[#eb5a5a] rounded-sm"></div>
                <h3 className="text-[22px] md:text-[24px] font-bold text-txt-primary tracking-tight">본인증</h3>
              </div>
              
              {/* 신청시기 */}
              <div className="mb-10 pl-1 md:pl-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-[#facc15] rounded-full"></div>
                  <h4 className="text-[17px] font-bold text-txt-primary">신청시기</h4>
                </div>
                
                <div className="pl-6 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <div className="mb-1">- 개별시설</div>
                  <ul className="pl-4 mb-4 space-y-1.5">
                    <li className="relative pl-3 before:absolute before:left-0 before:content-['·'] font-medium">
                      장애인등편의법 제7조에 따른 대상시설, 교통약자법 제9조에 따른 여객시설 및 도로: 개별시설의 공사를 완료한 후
                    </li>
                    <li className="relative pl-3 before:absolute before:left-0 before:content-['·'] font-medium">
                      교통약자법 제9조에 따른 교통수단: 「자동차관리법」 제5조에 따른 등록, 「선박법」 제8조에 따른 등록 및 「항공법」 제3조에 따른 등록 또는 그 밖의 법령에 따라 운행허가를 받은 이후
                    </li>
                  </ul>
                  
                  <div className="mb-1">- 지역</div>
                  <ul className="pl-4 space-y-1.5">
                    <li className="relative pl-3 before:absolute before:left-0 before:content-['·'] font-medium">
                      지역: 「국토의 계획 및 이용에 관한 법률」 제98조 또는 그 밖의 법령에 따른 공사 등의 완료 후
                    </li>
                  </ul>
                </div>
              </div>

              {/* 인증절차 (SVG 도표) */}
              <div className="pl-1 md:pl-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-[#facc15] rounded-full"></div>
                  <h4 className="text-[17px] font-bold text-txt-primary">인증절차</h4>
                </div>
                <div className="w-full overflow-x-auto">
                  <img 
                    src={BFProcess2} 
                    alt="본인증 절차 도표" 
                    className="w-full min-w-[700px] h-auto object-contain auto-invert" 
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BF_Process;