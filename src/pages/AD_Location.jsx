import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AD_Location = () => {
  // 네이버 지도 검색 결과 주소
  const mapUrl = "https://map.naver.com/v5/search/%EC%B2%AD%EC%88%985%EB%A1%9C%209/address/14154768.2921403,4408962.7689035,15,14154768.2921403,4408962.7689035,15,14154768.2921403,4408962.7689035,15";

  return (
    <div className="min-h-screen bg-main font-sans txt-main">
      <Header />

      <main>
        {/* 서브 페이지 헤더 */}
        <section className="bg-card border-b border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold txt-main mb-4">오시는 길</h2>
            <div className="text-[13px] txt-main flex justify-center gap-2">
              <span>Home</span>
              <span className="txt-main">&gt;</span>
              <span>사람과건축 소개</span>
              <span className="txt-main">&gt;</span>
              <span className="font-bold txt-main">오시는 길</span>
            </div>
          </div>
        </section>

        {/* 본문 영역 */}
        <section className="py-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 1. 지도 영역 */}
            <div className="mb-12">
              <div className="w-full h-[450px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                {/* 참고: 실제 네이버 지도 API를 연동하거나, 
                  네이버 지도에서 '공유 > HTML 태그 복사'를 통해 아래 div를 교체할 수 있습니다. 
                */}
                <iframe 
                  title="naver-map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3215.123!2d127.15!3d36.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ2JzQ4LjAiTiAxMjfCsDA5JzAwLjAiRQ!5e0!3m2!1sko!2skr!4v123456789"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                
                {/* 지도 위에 바로가기 버튼 (모바일 배려) */}
                <div className="absolute bottom-4 right-4">
                  <a 
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white px-4 py-2 rounded-md shadow-md text-sm font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-green-500">N</span> 네이버 지도에서 보기
                  </a>
                </div>
              </div>
            </div>

            {/* 2. 주소 및 연락처 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 bg-[#f8fcfc] rounded-2xl border border-[#e6f2f2]">
                <h4 className="text-[#317F81] font-bold text-lg mb-4 flex items-center gap-2">
                  📍 주소 안내
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  [31198] <br />
                  <strong>충청남도 천안시 동남구 청수5로 9, 7층</strong> <br />
                  (사단법인 사람과건축)
                </p>
              </div>
              <div className="p-8 bg-[#f8fcfc] rounded-2xl border border-[#e6f2f2]">
                <h4 className="text-[#317F81] font-bold text-lg mb-4 flex items-center gap-2">
                  📞 연락처 정보
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold w-16 inline-block">TEL</span> 041 - 900 - 4980</p>
                  <p><span className="font-semibold w-16 inline-block">FAX</span> 041 - 900 - 4981</p>
                  <p><span className="font-semibold w-16 inline-block">EMAIL</span> pbpb24@naver.com</p>
                </div>
              </div>
            </div>

            {/* 3. 교통수단별 안내 */}
            <div className="border-t border-gray-100 pt-12 space-y-10">
              <div>
                <h4 className="text-xl font-bold txt-main mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 txt-main rounded-full flex items-center justify-center text-sm">🚌</span>
                  버스 이용 시
                </h4>
                <p className="txt-main ml-10 break-keep">
                  청수지구 우미린아파트 또는 청수동 가온중학교 정류장 하차 후 도보 약 5분 소요
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold txt-main mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">🚗</span>
                  자가용 이용 시
                </h4>
                <p className="txt-main ml-10 break-keep">
                  천안 IC 진출 후 청수 행정타운 방면으로 약 15분 이동 <br />
                  * 건물 내 지하주차장 이용이 가능합니다.
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