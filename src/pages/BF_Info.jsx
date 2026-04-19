import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BF_Info = () => {
  return (
    <div className="min-h-screen bg-main font-sans txt-main">
      <Header />

      <main>
        {/* 서브 페이지 헤더 */}
        <section className="bg-main border-b border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold txt-main mb-4">BF인증 개요</h2>
            <div className="text-[13px] txt-main flex justify-center gap-2">
              <span>Home</span>
              <span className="txt-main">&gt;</span>
              <span>장애물 없는 생활환경 인증</span>
              <span className="txt-main">&gt;</span>
              <span className="font-bold txt-main">인증 개요</span>
            </div>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="py-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 1. BF인증이란? */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold txt-main mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-main block"></span>
                BF(Barrier Free) 인증제도란?
              </h3>
              <div className="bg-main p-8 rounded-2xl border border-[#e6f2f2] leading-relaxed txt-main break-keep">
                <p className="mb-4">
                  <strong>'장애물 없는 생활환경(Barrier Free) 인증'</strong>이란 어린이·노인·장애인·임산부뿐만 아니라 일시적 장애인 등 모든 사람이 개별 시설물·지역을 이용함에 있어 불편을 느끼지 않도록 계획·설계·시공되는지를 전문가가 객관적으로 평가하여 인증하는 제도입니다.
                </p>
                <p>
                  교통약자의 이동편의 증진법 및 장애인·노인·임산부 등의 편의증진 보장에 관한 법률에 근거하여 시행되고 있습니다.
                </p>
              </div>
            </div>

            {/* 2. 인증 종류 표 */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold txt-main mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-main block"></span>
                인증의 구분
              </h3>
              <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-main border-b border-gray-200 text-sm font-bold">
                    <tr>
                      <th className="px-6 py-4 border-r border-gray-200">구분</th>
                      <th className="px-6 py-4 border-r border-gray-200">예비인증</th>
                      <th className="px-6 py-4">본인증</th>
                    </tr>
                  </thead>
                  <tbody className="text-[15px] divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-5 bg-main font-semibold border-r border-gray-200">신청시기</td>
                      <td className="px-6 py-5 border-r border-gray-200">설계도면이 완성된 후 공사착공 전</td>
                      <td className="px-6 py-5">공사 준공(사용승인) 전</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5 bg-main font-semibold border-r border-gray-200">인증대상</td>
                      <td className="px-6 py-5 border-r border-gray-200">설계도서(도면, 시방서 등)</td>
                      <td className="px-6 py-5">완공된 건축물 및 시설물</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5 bg-main font-semibold border-r border-gray-200">유효기간</td>
                      <td className="px-6 py-5 border-r border-gray-200">본인증 전까지 유효</td>
                      <td className="px-6 py-5">인증일로부터 10년</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. 인증 등급 */}
            <div>
              <h3 className="text-2xl font-bold txt-main mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-main block"></span>
                인증 등급
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { grade: "최우수", score: "만점의 90% 이상", color: "border-blue-500 txt-main bg-main" },
                  { grade: "우수", score: "만점의 80% 이상 90% 미만", color: "border-[#317F81] txt-main bg-main" },
                  { grade: "일반", score: "만점의 70% 이상 80% 미만", color: "border-gray-400 txt-main bg-main" },
                ].map((item, idx) => (
                  <div key={idx} className={`p-8 border-t-4 rounded-xl shadow-sm text-center ${item.color}`}>
                    <div className="text-xl font-bold mb-2">{item.grade}</div>
                    <div className="text-sm opacity-80">{item.score}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BF_Info;