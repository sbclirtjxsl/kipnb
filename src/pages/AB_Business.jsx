import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const businessList = [
  {
    title: "BF인증 사업",
    description: "장애인·노인·임산부 등의 편의증진 보장에 관한 법률에 의거하여 건축물 및 시설물의 배리어 프리 인증 심사 및 상담을 진행합니다.",
    tags: ["본인증", "예비인증", "사후관리"],
    icon: "🏢"
  },
  {
    title: "공공디자인 컨설팅",
    description: "도시 공간의 공공성과 심미성을 높이기 위한 공공디자인 가이드라인 수립 및 전문가 컨설팅 서비스를 제공합니다.",
    tags: ["도시재생", "가이드라인", "디자인 심의"],
    icon: "🎨"
  },
  {
    title: "연구 및 정책개발",
    description: "교통약자를 위한 무장애 환경 조성 및 미래 건축 정책에 관한 다각도의 연구와 논문 출판을 수행합니다.",
    tags: ["정책연구", "학술세미나", "국책과제"],
    icon: "📚"
  },
  {
    title: "교육 및 홍보사업",
    description: "인식 개선을 위한 BF 교육 프로그램 운영과 관련 기술 보급을 위한 세미나 및 홍보 활동을 전개합니다.",
    tags: ["전문가 양성", "인식개선", "포럼"],
    icon: "📢"
  }
];

const AB_Business = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main>
        {/* 서브 페이지 헤더 */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">사업분야</h2>
            <div className="text-[13px] text-gray-500 flex justify-center gap-2">
              <span>Home</span>
              <span className="text-gray-300">&gt;</span>
              <span>사람과건축 소개</span>
              <span className="text-gray-300">&gt;</span>
              <span className="font-bold text-[#317F81]">사업분야</span>
            </div>
          </div>
        </section>

        {/* 본문 영역 */}
        <section className="py-20">
          <div className="max-w-[1100px] mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">주요 사업 안내</h3>
              <p className="text-gray-500 break-keep">
                (사)사람과건축은 모두가 살기 좋은 무장애 환경을 만들기 위해 <br className="hidden md:block" />
                전문적인 인증 서비스와 연구 활동에 매진하고 있습니다.
              </p>
            </div>

            {/* 사업 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {businessList.map((item, index) => (
                <div 
                  key={index} 
                  className="group p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-[#317F81] mb-4">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed mb-6 break-keep">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx} 
                        className="px-3 py-1 bg-[#f0f9f9] text-[#317F81] text-xs font-semibold rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AB_Business;