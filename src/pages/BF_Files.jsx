import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BF_Files = () => {
  const fileList = {
    pre: [
      "인증신청서 (별지 제1호 서식)",
      "사업자등록증 사본 (또는 고유번호증)",
      "건축허가서 (또는 협의사항 확인서) 사본",
      "설계도서 (평면도, 입면도, 단면도, 편의시설 상세도 등)",
      "기타 심사에 필요한 서류 (주차계획, 조경계획 등)"
    ],
    main: [
      "인증신청서 (별지 제1호 서식)",
      "사용승인서 (또는 준공인가증) 사본",
      "공사완료 사진 (주요 편의시설별 근접 및 원경 사진)",
      "시공도면 (최종 변경 도면 포함)",
      "예비인증을 받은 경우 예비인증서 사본"
    ]
  };

  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300">
      <Header />

      <main>
        {/* 서브 페이지 헤더 - 가로선(border-b) 제거됨 */}
        <section className="bg-bg-base py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-txt-primary mb-4">인증 신청 첨부물</h2>
            <div className="text-[13px] text-txt-muted flex justify-center items-center gap-2">
              <span>장애물 없는 생활환경 인증</span>
              <span className="text-[10px] opacity-50">&gt;</span>
              <span className="font-bold text-brand-main">인증 신청 첨부물</span>
            </div>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="py-1">
          <div className="max-w-[1000px] mx-auto px-4 py-2">
            
            {/* 안내 문구: 브랜드 컬러로 포인트 라인 */}
            <div className="mb-16 border-l-4 border-brand-main pl-6 py-2">
              <h3 className="text-xl font-bold mb-2 text-txt-primary">인증 신청 시 제출 서류 안내</h3>
              <p className="text-txt-secondary text-sm break-keep leading-relaxed">
                인증 신청을 위해서는 아래의 서류를 구비하여 접수해 주시기 바랍니다. <br />
                모든 서류는 PDF 파일로 스캔하여 온라인 접수 시 첨부해 주셔야 합니다.
              </p>
            </div>

            {/* 서류 리스트 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-10">
              
              {/* 예비인증 서류 (Brand Light 활용) */}
              <div className="bg-bg-surface border border-bd-subtle rounded-2xl overflow-hidden shadow-sm hover:border-brand-main hover:shadow-md transition-all">
                {/* 헤더: 은은한 브랜드 톤 */}
                <div className="bg-brand-light px-6 py-4 text-brand-main font-bold text-lg border-b border-brand-main/10">
                  📘 예비인증 제출 서류
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {fileList.pre.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[15px] text-txt-secondary">
                        <span className="text-brand-main mt-0.5 text-sm">✔</span>
                        <span className="break-keep">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 본인증 서류 (Brand Main 활용) */}
              <div className="bg-bg-surface border border-bd-subtle rounded-2xl overflow-hidden shadow-sm hover:border-brand-main hover:shadow-md transition-all">
                {/* 헤더: 강렬한 브랜드 톤 */}
                <div className="bg-brand-main px-6 py-4 text-txt-inverse font-bold text-lg">
                  🏢 본인증 제출 서류
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {fileList.main.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[15px] text-txt-secondary">
                        <span className="text-brand-main mt-0.5 text-sm">✔</span>
                        <span className="break-keep">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* 추가 안내 사항 (팁) */}
            <div className="bg-bg-surface p-8 rounded-2xl border border-bd-subtle mb-16 shadow-sm">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-txt-primary">
                <span className="text-yellow-500">💡</span> 유의사항 및 준비 팁
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-txt-secondary leading-relaxed break-keep">
                <div>
                  <h5 className="font-bold text-txt-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-main"></span>
                    파일 형식 및 용량
                  </h5>
                  <p>도면은 식별이 가능하도록 고해상도 PDF로 준비하시되, 개별 파일당 50MB를 초과하지 않도록 해주세요.</p>
                </div>
                <div>
                  <h5 className="font-bold text-txt-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-main"></span>
                    도면의 범위
                  </h5>
                  <p>단위 세대 평면도 뿐만 아니라 공용부(주차장, 접근로, 승강기 등)의 상세도가 반드시 포함되어야 합니다.</p>
                </div>
                <div>
                  <h5 className="font-bold text-txt-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-main"></span>
                    사진 촬영(본인증)
                  </h5>
                  <p>주요 편의시설(경사로, 점자블록 등)은 줄자를 대고 규격을 확인할 수 있게 촬영하면 심사가 빨라집니다.</p>
                </div>
              </div>
            </div>

            {/* 하단 바로가기 버튼 */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
              {/* 메인 버튼 */}
              <button className="w-full sm:w-auto px-10 py-4 bg-brand-main text-txt-inverse font-bold rounded-lg hover:bg-brand-dark transition-all shadow-md">
                인증 신청 서식 다운로드
              </button>
              {/* 보조 버튼 */}
              <button className="w-full sm:w-auto px-10 py-4 border border-bd-strong text-txt-primary font-bold bg-bg-surface rounded-lg hover:bg-bg-surface-hover transition-all">
                온라인 신청 바로가기
              </button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BF_Files;