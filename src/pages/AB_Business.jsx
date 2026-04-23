import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 수정된 WebP 이미지 경로
import BusinessMainImg from '../assets/page_image/Business.webp'; 
import LogoMolit from '../assets/logos/MOLIT_logo.webp';     
import LogoChungnam from '../assets/logos/Chungnam.webp';   

// 💡 알록달록했던 color 속성을 제거하고 순수 데이터만 남겼습니다.
const businessData = [
  {
    id: 1,
    title: "공공 건축물에 대한 지속 가능한 친환경·에너지절약 건축기술 보급 사업",
    subItems: [
      "가. 신축건축물의 경제적·친환경·에너지절약형 기술도입을 위한 기술지원",
      "나. 친환경 에너지절약형 건축물 구현을 위한 설계, 시공, 감리자등 건축 관련 기술자 교육",
      "다. 노후된 공공건축물의 에너지 성능진단 및 성능개선사업",
      "라. 지역기업과 연계된 지속 가능한 친환경 기술컨설팅 및 제품 개발 지원 사업",
      "마. 지속 가능한 건축에 관한 조사, 연구, 자문, 지원"
    ]
  },
  {
    id: 2,
    title: "공공건축물의 신축 및 리모델링 건축물에 대한 장애물 없는 생활환경을 개선 사업",
    subItems: [
      "가. 신축건축물의 장애물 없는 건축물 설계지원 및 장애인 적합성 건축물 구현",
      "나. 노후 건축물을 포함한 기축 건축물에 대한 장애인 없는 생활환경 현황조사 및 개선방안 도출",
      "다. 건축물 등 시설에 대한 장애물 없는 생활환경 향상을 위한 각종 지식·기술을 습득·보급",
      "라. 현장실무를 기반으로 공공건축물 등 시설에 대한 장애물 없는 생활환경 구축을 위한 법령, 시책에 관한 조사와 개선방안 검토 및 건의",
      "마. 장애인에 대한 사회적 인식개선 등 장애인복지 관련 교육, 홍보, 컨설팅",
      "바. 편의시설 설치 기술지원, 장애물 없는 생활환경 조성 등 장애인 편의 증진 사업 지원"
    ]
  },
  {
    id: 3,
    title: "건축물 관련된 인증컨설팅 지원사업",
    subItems: [
      "가. 장애물 없는 생활환경 인증, 녹색건축인증, 건축물에너지효율등급인증, 제로에너지건축물 인증 등 신축, 개축, 리모델링 건축물의 인증지원사업",
      "나. 충청남도 녹색건축 설계기준 적용방안 지원사업",
      "다. 충청남도 건축 관련 기업의 지속 가능한 건축기술, 장애물 없는 생활환경 구축을 위한 교육지원사업"
    ]
  },
  {
    id: 4,
    title: "지속 가능한 건축기술 및 장애물 없는 생활환경 설계기준에 대한 기술자 교육프로그램 운영사업",
    subItems: [
      "가. 충청남도에 소재한 설계사, 시공회사, 감리회사, 기타 건축 관련 회사에 소속된 기술자의 교육",
      "나. 충청남도에서 시공 중인 건축현장에 종사하고 있는 기술자 교육"
    ]
  },
  {
    id: 5,
    title: "기타 제3조의 목적에 부합되는 각종 경제사업 및 부대사업",
    subItems: []
  }
];

const AB_Business = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary overflow-x-hidden transition-colors duration-300">
      <Header />

      <main className="relative">
        {/* 서브 페이지 헤더 */}
        <section className="py-10 text-center">
          <h2 className="text-3xl font-bold mb-3 text-txt-primary">사업분야</h2>
          <div className="text-sm text-txt-muted flex justify-center items-center gap-2">
            <span>사람과건축 소개</span> 
            <span className="text-[10px] opacity-50">&gt;</span> 
            <span className="font-bold text-brand-main">사업분야</span>
          </div>
        </section>

        {/* 상단 메인 이미지 */}
        <div className="max-w-[1000px] mx-auto px-4 mb-20">
          <div className="w-full h-[150px] md:h-[300px] rounded-xl shadow-sm border border-bd-subtle overflow-hidden">
            <img 
              src={BusinessMainImg} 
              alt="사업 배경" 
              className="w-full h-full object-cover object-center transition-opacity duration-300 dark:opacity-90" 
            />
          </div>
        </div>

        {/* 💡 배경 장식 요소들: 
          원색(red-500 등)을 쓰면 전문성이 떨어져 보일 수 있어, 
          brand 컬러 파생 및 은은한 무채색 계열로 변경하여 다크모드에서도 자연스럽게 배경에 스며들도록 했습니다.
        */}
        <div className="absolute top-[600px] left-[-20px] w-12 h-12 bg-brand-light rounded-lg rotate-12 opacity-50 dark:opacity-10 hidden lg:block"></div>
        <div className="absolute top-[800px] left-[5%] text-bd-strong text-4xl opacity-30 dark:opacity-20 hidden lg:block">★</div>
        <div className="absolute bottom-[200px] left-[10%] w-16 h-16 bg-bd-subtle rounded-full opacity-60 dark:opacity-10 hidden lg:block"></div>
        <div className="absolute top-[900px] right-[5%] w-10 h-10 bg-brand-main rounded-full opacity-20 dark:opacity-10 hidden lg:block"></div>

        {/* 사업 리스트 (타임라인 스타일) */}
        <section className="pb-24 relative z-10">
          <div className="max-w-[900px] mx-auto px-6">
            <p className="text-center text-[15px] md:text-[16px] text-txt-secondary mb-16 break-keep leading-relaxed">
              사단법인 사람과 건축은 다음과 같은 사업과 활동을 통해 목적을 달성하고자 합니다.
            </p>

            {/* 타임라인 축: border-bd-default 적용 */}
            <div className="relative border-l-2 border-bd-default ml-4 md:ml-8 space-y-16">
              {businessData.map((item) => (
                <div key={item.id} className="relative pl-10 group">
                  {/* 💡 타임라인 포인트: 
                    각기 다른 원색 대신, 전문적인 brand-main 컬러로 통일.
                    ring(테두리)을 주어 선과 겹치는 부분을 깔끔하게 파냈습니다.
                  */}
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-brand-main shadow-sm ring-4 ring-bg-base transition-colors duration-300 group-hover:bg-brand-dark"></div>
                  
                  {/* 제목 */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="inline-flex items-center justify-center border border-bd-strong text-txt-secondary rounded-full min-w-[24px] h-[24px] text-xs font-bold mt-0.5 bg-bg-surface transition-colors">
                      {item.id}
                    </span>
                    <h4 className="text-[17px] font-bold text-txt-primary leading-snug group-hover:text-brand-main transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  {/* 서브 리스트 */}
                  {item.subItems.length > 0 && (
                    <ul className="space-y-2 ml-1">
                      {item.subItems.map((sub, sIdx) => (
                        <li key={sIdx} className="text-[14px] md:text-[15px] text-txt-secondary leading-relaxed break-keep pl-4 -indent-4">
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-24 text-center text-[15px] md:text-[16px] text-txt-primary font-medium leading-relaxed break-keep p-8 bg-bg-surface rounded-2xl border border-bd-subtle">
              사단법인 사람과 건축은 다양한 분야의 전문가들과 함께 협력할 것이며, 건축 환경의 중요성을 대중에게 알리고,<br className="hidden md:block" />
              건축 환경의 미래를 위한 비전을 제시할 것입니다.
            </p>
          </div>
        </section>

        {/* 하단 로고 영역 */}
        <div className="border-t border-bd-default py-12">
          <div className="max-w-[1200px] mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="text-lg font-bold text-txt-primary tracking-tighter">PEOPLE & BUILDING</div>
              <img src={LogoMolit} alt="국토교통부" className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-all" />
              <img src={LogoChungnam} alt="충청남도" className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-all" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AB_Business;