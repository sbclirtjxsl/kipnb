import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AD_Location = () => {
  // 네이버 지도 검색 결과 주소
  const mapUrl = "https://map.naver.com/v5/search/%EC%B2%AD%EC%88%985%EB%A1%9C%209/address/14154768.2921403,4408962.7689035,15,14154768.2921403,4408962.7689035,15,14154768.2921403,4408962.7689035,15";

  return (
    /* 1. 전체 배경 및 기본 텍스트 색상 연동 */
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300">
      <Header />

      <main>
        {/* 서브 페이지 헤더 (타이틀 영역) */}
        <section className="py-10 text-center">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-3xl font-bold mb-3 text-txt-primary">오시는 길</h2>
            <div className="text-sm text-txt-muted flex justify-center items-center gap-2">
              <span>사람과건축 소개</span>
              <span className="text-[10px] opacity-50">&gt;</span>
              <span className="font-bold text-brand-main">오시는 길</span>
            </div>
          </div>
        </section>

        {/* 본문 영역 */}
        <section className="pb-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 1. 지도 영역 */}
            <div className="mb-12">
              <div className="w-full h-[450px] bg-bg-surface rounded-xl overflow-hidden border border-bd-subtle shadow-sm relative">
                <iframe 
                  title="naver-map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3215.123!2d127.15!3d36.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ2JzQ4LjAiTiAxMjfCsDA5JzAwLjAiRQ!5e0!3m2!1sko!2skr!4v123456789"
                  className="w-full h-full border-0 grayscale-[20%] dark:grayscale-[40%] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-300"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                
                {/* 지도 위에 바로가기 버튼 */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a 
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-bg-surface px-4 py-2 rounded-md shadow-md border border-bd-default text-sm font-bold text-txt-primary flex items-center gap-2 hover:bg-bg-surface-hover transition-colors"
                  >
                    {/* 네이버 고유의 초록색은 인지성을 위해 유지하거나 살짝 조정 */}
                    <span className="text-[#03c75a] dark:text-[#2db400]">N</span> 네이버 지도에서 보기
                  </a>
                </div>
              </div>
            </div>

            {/* 2. 주소 및 연락처 정보 박스 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* 기존 연한 청록색 하드코딩 대신 bg-bg-surface를 사용하고 테두리에 포인트를 줌 */}
              <div className="p-8 bg-bg-surface rounded-2xl border border-bd-subtle hover:border-brand-main transition-colors">
                <h4 className="text-brand-main font-bold text-lg mb-4 flex items-center gap-2">
                  📍 주소 안내
                </h4>
                <p className="text-txt-secondary leading-relaxed break-keep">
                  [31198] <br />
                  <strong className="text-txt-primary">충청남도 천안시 동남구 청수5로 9, 7층</strong> <br />
                  (사단법인 사람과건축)
                </p>
              </div>
              
              <div className="p-8 bg-bg-surface rounded-2xl border border-bd-subtle hover:border-brand-main transition-colors">
                <h4 className="text-brand-main font-bold text-lg mb-4 flex items-center gap-2">
                  📞 연락처 정보
                </h4>
                <div className="space-y-2 text-txt-secondary">
                  <p><span className="font-semibold text-txt-primary w-16 inline-block">TEL</span> 041 - 900 - 4980</p>
                  <p><span className="font-semibold text-txt-primary w-16 inline-block">FAX</span> 041 - 900 - 4981</p>
                  <p><span className="font-semibold text-txt-primary w-16 inline-block">EMAIL</span> pbpb24@naver.com</p>
                </div>
              </div>
            </div>

            {/* 3. 교통수단별 안내 */}
            <div className="border-t border-bd-default pt-12 space-y-10">
              <div>
                <h4 className="text-xl font-bold text-txt-primary mb-4 flex items-center gap-3">
                  {/* 알록달록한 배경 대신 브랜드 컬러 베이스의 아이콘 컨테이너 사용 */}
                  <span className="w-10 h-10 bg-brand-light text-brand-main rounded-xl flex items-center justify-center text-lg shadow-sm">🚌</span>
                  버스 이용 시
                </h4>
                <p className="text-txt-secondary ml-13 break-keep leading-relaxed">
                  청수지구 우미린아파트 또는 청수동 가온중학교 정류장 하차 후 도보 약 5분 소요
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-txt-primary mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-brand-light text-brand-main rounded-xl flex items-center justify-center text-lg shadow-sm">🚗</span>
                  자가용 이용 시
                </h4>
                <p className="text-txt-secondary ml-13 break-keep leading-relaxed">
                  천안 IC 진출 후 청수 행정타운 방면으로 약 15분 이동 <br />
                  <span className="text-txt-muted text-sm mt-1 inline-block">* 건물 내 지하주차장 이용이 가능합니다.</span>
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AD_Location;