import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// assets 폴더에 있는 SVG 파일들을 불러옵니다.
import BFFiles1 from '../assets/BF_Files1.svg';
import BFFiles2 from '../assets/BF_Files2.svg';

// 📂 팩트: 경로 끝에 '?url'을 붙여 바이너리 분석 에러를 완벽히 우회합니다.
import PreAuthFile from '../assets/file/예비인증 신청서(장애물 없는 생활환경 인증에 관한 규칙).hwp?url';
import MainAuthFile from '../assets/file/본인증 신청서(장애물 없는 생활환경 인증에 관한 규칙).hwp?url';

// 사진과 똑같은 문서 형태의 아이콘을 만들어주는 컴포넌트입니다.
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-transform cursor-pointer">
    <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
  </svg>
);

const BF_Files = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300 flex flex-col">
      <Header />

      <main className="flex-grow relative">
        {/* 타이틀 영역 */}
        <section className="pt-12 pb-8">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-extrabold text-txt-primary tracking-tight">
              인증 신청 첨부물
            </h2>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="pb-24 z-10 relative">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            
            {/* 1. 예비인증 신청관련 서류 */}
            <div className="mb-16 container-with-scrolling">
              <div className="w-full overflow-x-auto">
                {/* min-w 적용으로 모바일 스크롤 완벽 대응 */}
                <div className="relative w-full min-w-[700px]">
                  <img 
                    src={BFFiles1} 
                    alt="예비인증 신청관련 서류" 
                    className="w-full h-auto object-contain auto-invert block" 
                  />
                  
                  {/* 예비인증 1번 파일 링크 (로컬 HWP 파일 다운로드) */}
                  <a 
                    href={PreAuthFile} 
                    download="예비인증 신청서(장애물 없는 생활환경 인증에 관한 규칙).hwp"
                    style={{ top: '33%', right: '12.5%', transform: 'translate(250%, -70%)' }}
                    className="absolute text-txt-primary hover:text-brand-main transition-colors file-icon-wrapper"
                    title="1. 예비인증 신청공문 및 인증신청서 다운로드"
                  >
                    <FileIcon />
                  </a>

                  {/* 예비인증 2번 파일 링크 (외부 URL) */}
                  <a 
                    href="https://www.koddi.or.kr/bf/popup/popup_kind.do" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ top: '49%', right: '12.5%', transform: 'translate(250%, -30%)' }}
                    className="absolute text-txt-primary hover:text-brand-main transition-colors file-icon-wrapper"
                    title="2. 예비인증 자체 평가서 다운로드 (KODDI 외부 링크)"
                  >
                    <FileIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. 본인증 신청관련 서류 */}
            <div className="container-with-scrolling">
              <div className="w-full overflow-x-auto">
                <div className="relative w-full min-w-[700px]">
                  <img 
                    src={BFFiles2} 
                    alt="본인증 신청관련 서류" 
                    className="w-full h-auto object-contain auto-invert block" 
                  />
                  
                  {/* 본인증 1번 파일 링크 (로컬 HWP 파일 다운로드) */}
                  <a 
                    href={MainAuthFile} 
                    download="본인증 신청서(장애물 없는 생활환경 인증에 관한 규칙).hwp"
                    style={{ top: '36%', right: '12.5%', transform: 'translate(250%, -110%)' }}
                    className="absolute text-txt-primary hover:text-brand-main transition-colors file-icon-wrapper"
                    title="1. 본인증 신청공문 및 인증신청서 다운로드"
                  >
                    <FileIcon />
                  </a>

                  {/* 본인증 2번 파일 링크 (외부 URL) */}
                  <a 
                    href="https://www.koddi.or.kr/bf/popup/popup_kind.do" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ top: '51%', right: '12.5%', transform: 'translate(250%, -60%)' }}
                    className="absolute text-txt-primary hover:text-brand-main transition-colors file-icon-wrapper"
                    title="2. 본인증 자체 평가서 다운로드 (KODDI 외부 링크)"
                  >
                    <FileIcon />
                  </a>
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

export default BF_Files;