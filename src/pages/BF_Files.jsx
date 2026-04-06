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
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main>
        {/* 서브 페이지 헤더 */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">인증 신청 첨부물</h2>
            <div className="text-[13px] text-gray-500 flex justify-center gap-2">
              <span>Home</span>
              <span className="text-gray-300">&gt;</span>
              <span>장애물 없는 생활환경 인증</span>
              <span className="text-gray-300">&gt;</span>
              <span className="font-bold text-[#317F81]">인증 신청 첨부물</span>
            </div>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="py-20">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 안내 문구 */}
            <div className="mb-16 border-l-4 border-[#317F81] pl-6 py-2">
              <h3 className="text-xl font-bold mb-2">인증 신청 시 제출 서류 안내</h3>
              <p className="text-gray-500 text-sm break-keep">
                인증 신청을 위해서는 아래의 서류를 구비하여 접수해 주시기 바랍니다. <br />
                모든 서류는 PDF 파일로 스캔하여 온라인 접수 시 첨부해 주셔야 합니다.
              </p>
            </div>

            {/* 서류 리스트 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
              
              {/* 예비인증 서류 */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-600 px-6 py-4 text-white font-bold text-lg">
                  📘 예비인증 제출 서류
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {fileList.pre.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[15px] text-gray-700">
                        <span className="text-blue-500 mt-1">✔</span>
                        <span className="break-keep">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 본인증 서류 */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#317F81] px-6 py-4 text-white font-bold text-lg">
                  🏢 본인증 제출 서류
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {fileList.main.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[15px] text-gray-700">
                        <span className="text-[#317F81] mt-1">✔</span>
                        <span className="break-keep">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* 추가 안내 사항 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-16">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="text-yellow-500">💡</span> 유의사항 및 준비 팁
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h5 className="font-bold text-gray-900 mb-2">파일 형식 및 용량</h5>
                  <p>도면은 식별이 가능하도록 고해상도 PDF로 준비하시되, 개별 파일당 50MB를 초과하지 않도록 해주세요.</p>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-2">도면의 범위</h5>
                  <p>단위 세대 평면도 뿐만 아니라 공용부(주차장, 접근로, 승강기 등)의 상세도가 반드시 포함되어야 합니다.</p>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-2">사진 촬영(본인증)</h5>
                  <p>주요 편의시설(경사로, 점자블록 등)은 줄자를 대고 규격을 확인할 수 있게 촬영하면 심사가 빨라집니다.</p>
                </div>
              </div>
            </div>

            {/* 하단 바로가기 버튼 */}
            <div className="text-center space-x-4">
              <button className="px-10 py-4 bg-[#317F81] text-white font-bold rounded-lg hover:bg-[#256062] transition-all shadow-md">
                인증 신청 서식 다운로드
              </button>
              <button className="px-10 py-4 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all">
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