import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const steps = [
  { id: "01", title: "인증신청", desc: "신청서 및 설계도서 접수", icon: "📝" },
  { id: "02", title: "서류심사", desc: "인증기준 적합성 검토", icon: "🔍" },
  { id: "03", title: "현장실사", desc: "현장 점검 및 심사(본인증)", icon: "🏗️" },
  { id: "04", title: "심사위원회", desc: "전문가 심사 및 의결", icon: "🤝" },
  { id: "05", title: "인증서 교부", desc: "인증서 및 인증명판 수여", icon: "📜" },
];

const BF_Process = () => {
  return (
    <div className="min-h-screen bg-main font-sans txt-main">
      <Header />

      <main>
        {/* 서브 페이지 헤더 */}
        <section className="bg-main border-b border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold txt-main mb-4">인증절차</h2>
            <div className="text-[13px] txt-main flex justify-center gap-2">
              <span>Home</span>
              <span className="txt-main">&gt;</span>
              <span>장애물 없는 생활환경 인증</span>
              <span className="txt-main">&gt;</span>
              <span className="font-bold txt-main">인증절차</span>
            </div>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="py-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 상단 안내 문구 */}
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold mb-4 italic txt-main">"신속하고 정확한 인증 서비스를 약속드립니다."</h3>
              <p className="txt-main break-keep">
                (사)사람과건축은 관련 법령에 의거하여 엄격하고 공정한 절차를 통해 <br className="hidden md:block" />
                모두가 편리한 생활환경을 조성하는 데 앞장서고 있습니다.
              </p>
            </div>

            {/* 프로세스 맵 (가로/세로 반응형) */}
            <div className="relative">
              {/* PC 버전 연결선 (가로선) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center group">
                    {/* 원형 번호/아이콘 */}
                    <div className="w-20 h-20 bg-main border-2 border-gray-100 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:border-[#317F81] group-hover:shadow-md transition-all duration-300 relative bg-main">
                      <span className="absolute -top-2 -left-2 w-7 h-7 bg-gray-800 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                        {step.id}
                      </span>
                      {step.icon}
                    </div>
                    
                    {/* 텍스트 정보 */}
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#317F81]">{step.title}</h4>
                      <p className="text-sm text-gray-500 break-keep leading-snug">{step.desc}</p>
                    </div>

                    {/* 모바일 버전 화살표 (세로형) */}
                    {idx !== steps.length - 1 && (
                      <div className="md:hidden my-4 text-gray-300 text-2xl">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 상세 설명 영역 */}
            <div className="mt-24 space-y-12">
              <div className="p-8 bg-main rounded-2xl border border-gray-100">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <span className="text-[#317F81]">✓</span> 예비인증 및 본인증 절차 안내
                </h4>
                <ul className="space-y-4 text-gray-600 list-disc ml-5">
                  <li><strong>접수방법:</strong> 온라인 신청 및 방문/우편 접수 가능</li>
                  <li><strong>소요일정:</strong> 신청서 접수일로부터 약 60일 이내 (보완기간 제외)</li>
                  <li><strong>심사비용:</strong> 인증 신청 대상 건축물의 면적 및 용도에 따라 산정</li>
                </ul>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-center gap-4">
                <button className="px-8 py-4 bg-[#317F81] text-white font-bold rounded-lg shadow-lg hover:bg-[#256062] transition-all">
                  인증 신청서 다운로드
                </button>
                <button className="px-8 py-4 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all">
                  수수료 안내 보기
                </button>
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