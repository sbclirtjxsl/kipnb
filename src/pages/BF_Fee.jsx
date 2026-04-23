import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const feeData = [
  { category: "1,000㎡ 미만", prev: "1,200,000", main: "2,400,000", total: "3,600,000" },
  { category: "1,000㎡ ~ 3,000㎡ 미만", prev: "1,500,000", main: "3,000,000", total: "4,500,000" },
  { category: "3,000㎡ ~ 5,000㎡ 미만", prev: "1,800,000", main: "3,600,000", total: "5,400,000" },
  { category: "5,000㎡ ~ 10,000㎡ 미만", prev: "2,100,000", main: "4,200,000", total: "6,300,000" },
  { category: "10,000㎡ 이상", prev: "별도 협의", main: "별도 협의", total: "-" },
];

const BF_Fee = () => {
  return (
    <div className="min-h-screen bg-bg-base font-sans text-txt-primary transition-colors duration-300">
      <Header />

      <main>
        {/* 서브 페이지 헤더 */}
        <section className="bg-bg-base py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-txt-primary mb-4">인증 수수료</h2>
            <div className="text-[13px] text-txt-muted flex justify-center items-center gap-2">
              <span>장애물 없는 생활환경 인증</span>
              <span className="text-[10px] opacity-50">&gt;</span>
              <span className="font-bold text-brand-main">인증 수수료</span>
            </div>
          </div>
        </section>

        {/* 본문 콘텐츠 */}
        <section className="py-1">
          <div className="max-w-[1000px] mx-auto px-4">
            
            {/* 상단 안내 박스: 은은한 브랜드 라이트 컬러 적용 */}
            <div className="mb-16 p-8 bg-brand-light rounded-2xl border border-brand-main/20 text-center transition-colors">
              <p className="text-brand-main font-bold text-lg mb-2 italic">"투명하고 공정한 수수료 체계를 준수합니다."</p>
              <p className="text-txt-secondary text-[15px] break-keep leading-relaxed">
                인증 수수료는 관련 법령 및 보건복지부 고시 기준에 의거하여 산정되며, <br className="hidden md:block" />
                건축물의 용도 및 규모에 따라 차등 적용됩니다. (VAT 별도)
              </p>
            </div>

            {/* 수수료 테이블 */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-txt-primary mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-brand-main block rounded-full"></span>
                인증 수수료 산정 기준 (예시)
              </h3>
              <div className="overflow-x-auto shadow-sm border border-bd-default rounded-xl">
                <table className="w-full text-center">
                  <thead className="bg-bg-surface border-b border-bd-strong text-sm font-bold text-txt-secondary">
                    <tr>
                      <th className="px-6 py-5 border-r border-bd-default">건축물 연면적</th>
                      {/* 예비인증과 본인증 색상 구분: 너무 튀지 않도록 text-txt-primary 유지하되 투명도로 구분하거나, 
                          브랜드 컬러를 유지하려면 다크모드 대응을 위해 변수 사용 */}
                      <th className="px-6 py-5 border-r border-bd-default">예비인증</th>
                      <th className="px-6 py-5 border-r border-bd-default text-brand-main">본인증</th>
                      <th className="px-6 py-5 bg-bg-surface-hover">합계</th>
                    </tr>
                  </thead>
                  <tbody className="text-[15px] divide-y divide-bd-default text-txt-primary">
                    {feeData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-bg-surface-hover transition-colors">
                        <td className="px-6 py-5 font-semibold bg-bg-surface/50 border-r border-bd-default">{item.category}</td>
                        <td className="px-6 py-5 border-r border-bd-default">{item.prev}원</td>
                        <td className="px-6 py-5 border-r border-bd-default">{item.main}원</td>
                        <td className="px-6 py-5 font-bold text-txt-primary bg-bg-surface border-l border-bd-default">{item.total}{item.total !== "-" && "원"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 주의사항 및 안내 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-bd-default bg-bg-surface rounded-2xl shadow-sm hover:border-txt-muted transition-colors">
                <h4 className="font-bold text-lg text-txt-primary mb-4 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span> 수수료 납부 안내
                </h4>
                <ul className="space-y-3 text-txt-secondary text-sm list-disc ml-5 break-keep">
                  <li>수수료는 인증 신청 후 안내되는 계좌로 입금해 주시기 바랍니다.</li>
                  <li>입금 확인 후 심사가 시작되며, 전자세금계산서가 발행됩니다.</li>
                  <li>인증 취소 시 시점에 따라 환불 규정이 다르게 적용될 수 있습니다.</li>
                </ul>
              </div>
              
              <div className="p-8 border border-bd-default bg-bg-surface rounded-2xl shadow-sm hover:border-brand-main transition-colors">
                <h4 className="font-bold text-lg text-brand-main mb-4 flex items-center gap-2">
                  <span>💡</span> 추가 안내 사항
                </h4>
                <ul className="space-y-3 text-txt-secondary text-sm list-disc ml-5 break-keep">
                  <li>동일 대지 내 다수의 동이 있는 경우 연면적 합계로 산정합니다.</li>
                  <li>특수 용도 건축물(공장, 창고 등)은 별도 견적이 필요합니다.</li>
                  <li>자세한 수수료 견적은 사무국으로 문의해 주시기 바랍니다.</li>
                </ul>
              </div>
            </div>

            {/* 문의 버튼 */}
            <div className="mt-16 text-center">
              <p className="text-txt-muted mb-6">수수료와 관련된 더 구체적인 상담이 필요하신가요?</p>
              {/* 버튼을 다크모드에서도 잘 보이도록 브랜드 컬러로 변경 */}
              <button className="px-10 py-4 bg-brand-main text-txt-inverse font-bold rounded-full hover:bg-brand-dark transition-all shadow-lg flex items-center gap-2 mx-auto">
                📞 수수료 관련 상담 문의하기
              </button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BF_Fee;