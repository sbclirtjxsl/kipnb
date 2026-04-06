import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AA__Greeting = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main>
        {/* 1. 서브 페이지 헤더 (타이틀 영역) */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">인사말</h2>
            <div className="text-sm text-gray-500 flex justify-center gap-2">
              <span>Home</span>
              <span>&gt;</span>
              <span>사람과건축 소개</span>
              <span>&gt;</span>
              <span className="font-bold text-[#317F81]">인사말</span>
            </div>
          </div>
        </section>

        {/* 2. 본문 영역 */}
        <section className="py-20">
          <div className="max-w-[1000px] mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              
              {/* 왼쪽: 이사장/대표 이미지 영역 */}
              <div className="w-full md:w-1/3">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-inner flex items-center justify-center">
                  {/* 실제 사진이 있다면 src에 넣으시면 됩니다 */}
                  <span className="text-gray-400 italic text-sm">대표 이미지 준비중</span>
                </div>
              </div>

              {/* 오른쪽: 인사말 텍스트 영역 */}
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-[#317F81] mb-6 leading-tight">
                  "사람 중심의 건축문화를 선도하는 <br />
                  사단법인 사람과건축입니다."
                </h3>
                
                <div className="space-y-6 text-[16px] leading-relaxed text-gray-700 break-keep">
                  <p>
                    안녕하십니까? 사단법인 사람과건축 홈페이지를 방문해 주셔서 진심으로 감사드립니다.
                  </p>
                  <p>
                    우리 법인은 건축이 단순한 물리적 구조물을 넘어 그 속에 살아가는 사람들의 삶의 질을 결정한다는 신념 아래, 
                    모든 사용자가 차별 없이 편리하게 이용할 수 있는 건축 환경을 조성하기 위해 노력해 왔습니다.
                  </p>
                  <p>
                    특히 <strong>배리어 프리(Barrier-Free)</strong> 인증과 연구를 통해 장애인, 노인, 임산부 등 
                    사회적 약자를 포함한 모든 구성원이 물리적 장벽 없이 자유롭게 소통할 수 있는 공간을 만드는 데 앞장서고 있습니다.
                  </p>
                  <p>
                    앞으로도 우리 사람과건축은 공익사업과 지속적인 연구를 통해 안전하고 아름다운 대한민국 건축 문화를 만들어가는 
                    든든한 파트너가 될 것을 약속드립니다.
                  </p>
                  <p>
                    여러분의 지속적인 관심과 성원을 부탁드립니다. 감사합니다.
                  </p>
                </div>

                {/* 하단 서명 영역 */}
                <div className="mt-12 text-right">
                  <p className="text-lg font-medium text-gray-500">사단법인 사람과건축</p>
                  <p className="text-2xl font-bold mt-2 text-gray-900">이사장 OOO (인)</p>
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

export default AA__Greeting;