import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 게시판별 맞춤 설정
const boardSettings = {
  // 1. 연구 및 공익사업 관련
  edu: { title: "교육/세미나", description: "진행 중인 교육 및 세미나 일정을 확인하세요.", showAttachment: false },
  publish: { title: "논문/출판", description: "연구 성과 및 관련 출판물 자료입니다.", showAttachment: true },
  pr: { title: "홍보", description: "사람과건축의 대외 활동 및 홍보 자료입니다.", showAttachment: false },

  // 2. BF관련 업체정보
  manufacture: { title: "제조업체 정보", description: "BF 관련 제조 업체 정보를 공유합니다.", showAttachment: false },
  construction: { title: "시공업체 정보", description: "BF 관련 전문 시공 업체 정보입니다.", showAttachment: false },
  consulting: { title: "컨설팅업체 정보", description: "BF 인증 컨설팅 전문 업체 안내입니다.", showAttachment: false },

  // 3. 인증 관련 서식
  forms: { title: "인증 관련 서식", description: "인증 신청에 필요한 각종 서식을 다운로드하세요.", showAttachment: true },

  // 4. 게시판
  notice: { title: "공지사항", description: "중요한 소식과 안내사항을 전해드립니다.", showAttachment: false },
  qna: { title: "문의상담", description: "궁금하신 점을 남겨주시면 답변해 드립니다.", showAttachment: false },

  // 5. 자료실
  archive: { title: "자료실", description: "학술 자료 및 기술 데이터를 확인하실 수 있습니다.", showAttachment: true },
};


const Notice = () => {
  const { category } = useParams(); // URL에서 notice, free, archive 등을 받아옴
  const navigate = useNavigate();
  
  // 현재 카테고리에 맞는 설정 가져오기 (없으면 공지사항 기본값)
  const currentBoard = boardSettings[category] || boardSettings.notice;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* 헤더 섹션: 카테고리에 따라 타이틀과 설명이 변함 */}
        <section className="bg-gray-50 py-16 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentBoard.title}</h2>
            <p className="text-gray-500 text-sm">{currentBoard.description}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-[1100px] mx-auto px-4">
            <div className="overflow-x-auto">
              <table className="w-full border-t-2 border-gray-800">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold">
                    <th className="py-4 w-20 text-center">번호</th>
                    <th className="py-4 px-4 text-left">제목</th>
                    {/* 자료실일 때만 '첨부' 컬럼을 보여줌 */}
                    {currentBoard.showAttachment && <th className="py-4 w-20 text-center">첨부</th>}
                    <th className="py-4 w-28 text-center">작성자</th>
                    <th className="py-4 w-28 text-center">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((num) => (
                    <tr key={num} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="py-4 text-center text-gray-400 text-sm">{num}</td>
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {currentBoard.title}의 {num}번째 게시물입니다.
                      </td>
                      {/* 자료실 아이콘 분기 처리 */}
                      {currentBoard.showAttachment && (
                        <td className="py-4 text-center">
                          <span className="text-gray-400 text-xl">💾</span>
                        </td>
                      )}
                      <td className="py-4 text-center text-sm text-gray-600">관리자</td>
                      <td className="py-4 text-center text-sm text-gray-500">2026.04.06</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-8 flex justify-end">
              <button 
                className="px-8 py-2.5 bg-[#317F81] text-white font-bold rounded hover:bg-[#256062] transition-colors shadow-md"
                onClick={() => navigate(`/board/${category}/write`)}
              >
                글쓰기
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Notice;