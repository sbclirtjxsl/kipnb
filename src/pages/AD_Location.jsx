import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AD_Location = () => {
  const mapRef = useRef(null);
  
  // 네이버 지도 검색 결과 주소 (바로가기 버튼용)
  const mapUrl = "https://map.naver.com/v5/search/%EC%B2%AD%EC%88%985%EB%A1%9C%209/address/14154768.2921403,4408962.7689035,15,14154768.2921403,4408962.7689035,15,14154768.2921403,4408962.7689035,15";

  useEffect(() => {
    // 네이버 지도 스크립트가 로드되었고, 지도를 넣을 DOM(mapRef)이 준비되었을 때 실행
    if (window.naver && mapRef.current) {
      // 제공해주신 천안시 동남구 청수5로 9 좌표 (위도, 경도)
      const location = new window.naver.maps.LatLng(36.786523, 127.155823); 
      
      const mapOptions = {
        center: location,
        zoom: 16, // 확대 레벨
        zoomControl: true, // 줌 컨트롤러 표시
        zoomControlOptions: {
          position: window.naver.maps.Position.RIGHT_BOTTOM
        }
      };

      // 지도 생성
      const map = new window.naver.maps.Map(mapRef.current, mapOptions);

      // 목적지 마커 표시
      new window.naver.maps.Marker({
        position: location,
        map: map,
        title: "사단법인 사람과건축"
      });
    }
  }, []);

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
              <span className="text-[10px] opacity-50">></span>
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
                
                {/* iframe 제거 후 API가 지도를 주입할 빈 div 공간 확보 */}
                <div 
                  ref={mapRef} 
                  className="w-full h-full"
                />
                
                {/* 지도 위에 바로가기 버튼 */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a 
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-bg-surface px-4 py-2 rounded-md shadow-md border border-bd-default text-sm font-bold text-txt-primary flex items-center gap-2 hover:bg-bg-surface-hover transition-colors"
                  >
                    <span className="text-[#03c75a] dark:text-[#2db400]">N</span> 네이버 지도에서 보기
                  </a>
                </div>
              </div>
            </div>

            {/* 2. 주소 및 연락처 정보 박스 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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