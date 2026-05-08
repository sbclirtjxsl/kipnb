import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BF_Info = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300 flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-grow relative">
        
        {/* 💡 배경 장식 요소들 (사진에 있는 아기자기한 도형 느낌 구현, 큰 화면에서만 보임) */}
        <div className="absolute top-[20%] right-[10%] w-8 h-8 bg-blue-500 rounded-md rotate-12 opacity-80 hidden lg:block"></div>
        <div className="absolute top-[40%] left-[5%] w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-yellow-400 opacity-90 hidden lg:block"></div>
        <div className="absolute top-[60%] right-[5%] w-6 h-6 bg-yellow-500 rounded-full opacity-90 hidden lg:block"></div>
        <div className="absolute top-[75%] left-[8%] w-8 h-8 bg-blue-500 rounded-md -rotate-12 opacity-80 hidden lg:block"></div>
        <div className="absolute bottom-[20%] right-[10%] text-red-500 text-3xl opacity-80 hidden lg:block">★</div>
        <div className="absolute bottom-[10%] left-[10%] w-6 h-6 bg-teal-400 rounded-full opacity-80 hidden lg:block"></div>

        {/* 본문 영역 (배너 없이 타이틀로 바로 시작) */}
        <section className="py-12 pb-24 relative z-10">
          <div className="max-w-[1000px] mx-auto px-6 md:px-8">
            
            {/* ✨ 수정됨: AA_Greeting과 동일하게 text-3xl로 크기를 고정하고 여백(mb-12)을 맞춤 */}
            <h2 className="text-3xl font-extrabold text-txt-primary mb-6 tracking-tight">
              BF 인증개요
            </h2>

            <div className="space-y-16">
              
              {/* 1. 인증 제도란? */}
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-txt-primary mb-4">
                  장애물 없는 생활환경 인증 제도란?
                </h3>
                <p className="text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep md:pl-4">
                  어린이·노인·장애인·임산부뿐만 아니라 일시적 장애인 등이 개별시설물·지역을 접근·이용·이동함에 있어<br className="hidden md:block" />
                  불편을 느끼지 않도록 계획·설계·시공·관리 여부를 공신력 있는 기관이 평가하여 인증하는 제도입니다.
                </p>
              </div>

              {/* 2. 법적 근거 */}
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-txt-primary mb-4">
                  법적 근거
                </h3>
                <ul className="list-disc pl-5 md:pl-9 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <li>「장애인·노인·임산부 등의 편의증진보장에 관한 법률」 제10조의2</li>
                  <li>「교통약자의 이동편의 증진법」 제17조의2</li>
                  <li>「장애물 없는 생활환경 인증에 관한 규칙」 [보건복지부, 국토교통부 공동부령]</li>
                  <li>「장애물 없는 생활환경(BF) 인증심사기준 및 수수료기준 등」</li>
                </ul>
              </div>

              {/* 3. 인증 대상 */}
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-txt-primary mb-4">
                  인증 대상
                </h3>
                <ul className="list-disc pl-5 md:pl-9 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <li>개별시설: 「장애인·노인·임산부 등의 편의증진 보장에 관한 법률」 제7조에 따른 대상시설, 「교통약자 이동편의 증진법」 제9조에 따른 교통수단, 여객시설, 도로</li>
                  <li>지역: 교통약자의 안전하고 편리한 이동을 위하여 교통수단·여객시설 및 도로를 계획 또는 정비한 시·군·구 및 「교통약자 이동편의 증진법」 제15조의2에 따른 지역</li>
                  <li className="list-none -ml-5 pl-5 relative mt-2">
                    <span className="absolute left-0">※</span>
                    「장애인·노인·임산부 등의 편의증진 보장에 관한 법률」 제10조의2제3항이 해당되는 공원, 신축건축물, 증축건축물(건축물이 있는 대지에 별개의 건축물로 증축하는경우), 개축건축물(전부개축하는 경우)은 의무적으로 인증을 받아야 하며, 법 제10조의2제3항에서 "대통령령으로 정하는 시설"이란 시행령 별표 2의2에 따른 시설을 말함
                  </li>
                </ul>
              </div>

              {/* 4. 인증신청자 */}
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-txt-primary mb-4">
                  인증신청자
                </h3>
                <ul className="list-disc pl-5 md:pl-9 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <li>개별시설: 개별시설의 소유자, 관리자 또는 시공자(교통수단, 여객시설, 도로의 시공자로서 소유자 또는 관리자가 인증 신청에 동의하는 경우)</li>
                  <li>지역: 지방자치단체의 장, 「교통약자 이동편의 증진법 시행령」 제15조의 2 제2호 및 제3호에 따른 지역의 개발사업 시행자</li>
                </ul>
              </div>

              {/* 5. 인증 종류 및 신청 시기 */}
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-txt-primary mb-4">
                  인증 종류 및 신청 시기
                </h3>
                <ul className="list-disc pl-5 md:pl-9 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <li>예비인증 : 개별시설 또는 지역의 설계에 반영된 내용을 대상으로 본인증 신청 전</li>
                  <li>본인증</li>
                </ul>
                <ul className="list-none pl-5 md:pl-9 mt-1.5 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <li>① 장애인등편의법 제7조에 따른 대상시설, 교통약자법 제9조에 따른 여객시설 및 도로: 개별시설의 공사를 완료한 후</li>
                  <li>② 교통약자법 제9조에 따른 교통수단: 「자동차관리법」 제5조에 따른 등록, 「선박법」 제8조에 따른 등록 및 「항공법」 제3조에 따른 등록 또는 그밖에 법령에 따라 운항허가를 받은 이후</li>
                  <li>③ 지역: 「국토의 계획 및 이용에 관한 법률」 제98조 또는 그 밖의 법령에 따른 공사 등의 완료 후</li>
                </ul>
                
                {/* 인증등급 표 (Table) */}
                <div className="mt-4 md:pl-4">
                  <p className="text-[15px] md:text-[16px] text-txt-secondary mb-2">인증등급</p>
                  <div className="overflow-x-auto border border-bd-default rounded-sm bg-bg-base">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead className="bg-bg-surface border-b border-bd-default text-[14px] md:text-[15px] text-txt-primary text-center">
                        <tr>
                          <th className="py-3 px-4 border-r border-bd-default w-[15%] font-medium">등급</th>
                          <th className="py-3 px-4 border-r border-bd-default w-[35%] font-medium">평가점수</th>
                          <th className="py-3 px-4 w-[50%] font-medium">비고</th>
                        </tr>
                      </thead>
                      <tbody className="text-[14px] md:text-[15px] text-txt-secondary">
                        <tr className="border-b border-bd-default">
                          <td className="py-4 px-4 border-r border-bd-default text-center align-middle">최우수 등급</td>
                          <td className="py-4 px-4 border-r border-bd-default text-center align-middle">인증 기준 만점의 100분의 90 이상</td>
                          {/* 💡 비고 열을 rowSpan="3"으로 병합하여 사진과 똑같이 구현했습니다. */}
                          <td rowSpan="3" className="py-4 px-6 leading-relaxed break-keep align-top">
                            「장애물 없는 생활환경 인증에 관한 규칙」제2조제1호가목에 따른 대상시설은 제8조에 따른 인증 기준의 항목별 최소기준 이상을 충족하여야 하고, 이를 충족하지 아니하는 경우에는 인증등급을 부여하지 아니함.<br/><br/>
                            「장애물 없는 생활환경 인증에 관한 규칙」 제2조제1호나목 및 같은 조 제2호에 따른 교통수단, 여객시설, 도로 및 지역의 경우 「교통약자의 이동편의 증진법 시행규칙」 제2조 및 별표 1에 따른 기준을 충족하여야하고, 이를 충족하지 아니하는 경우에는 인증등급을 부여하지 아니한다.
                          </td>
                        </tr>
                        <tr className="border-b border-bd-default">
                          <td className="py-4 px-4 border-r border-bd-default text-center align-middle">우수 등급</td>
                          <td className="py-4 px-4 border-r border-bd-default text-center align-middle">인증 기준 만점의 100분의 80 이상 100분의 90 미만</td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 border-r border-bd-default text-center align-middle">일반 등급</td>
                          <td className="py-4 px-4 border-r border-bd-default text-center align-middle">인증 기준 만점의 100분의 70 이상 100분의 80 미만</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 6. 인증 유효기간 */}
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-txt-primary mb-4">
                  인증 유효기간
                </h3>
                <ul className="list-disc pl-5 md:pl-9 space-y-1.5 text-[15px] md:text-[16px] text-txt-secondary leading-relaxed break-keep">
                  <li>본인증 : 10년</li>
                  <li>예비인증 : 본인증 전까지 효력을 유지하나 개별시설 및 지역 조성 등이 완료·허가된 후 1년 이내에 본인증을 신청하지 않는 경우 예비인증의 효력은 상실됨</li>
                </ul>
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