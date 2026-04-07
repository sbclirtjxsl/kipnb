import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// [1. 이미지 불러오기] 폴더 내의 파일명과 정확히 일치해야 합니다.
import BannerAd from '../assets/banner/Advertising.webp'; // 홍보용
import BannerArchive from '../assets/banner/Archive.webp'; // 자료실용
import BannerBook from '../assets/banner/Book.webp'; // 논문/출판용
import BannerTalk from '../assets/banner/converstation.webp'; // 교육/세미나용
import BannerNotice from '../assets/banner/Notice.webp'; // 공지사항용
import BannerQnA from '../assets/banner/QnA.webp'; // 문의상담용
import BannerWorkers from '../assets/banner/workers.webp'; // 업무담당자용

const boardSettings = {
  // 1. 연구 및 공익사업
  edu: { 
    title: "교육/세미나", 
    description: "진행 중인 교육 및 세미나 일정을 확인하세요.", 
    banner: BannerTalk 
  },
  publish: { 
    title: "논문/출판", 
    description: "연구 성과 및 관련 출판물 자료입니다.", 
    showAttachment: true,
    banner: BannerBook 
  },
  pr: { 
    title: "홍보", 
    description: "사람과건축의 대외 활동 및 홍보 자료입니다.", 
    banner: BannerAd 
  },

  // 2. BF관련 업체정보 (적당한 이미지를 매칭하거나 공통 이미지를 쓰세요)
  manufacture: { title: "제조업체 정보", description: "...", banner: BannerNotice },
  construction: { title: "시공업체 정보", description: "...", banner: BannerNotice },
  consulting: { title: "컨설팅업체 정보", description: "...", banner: BannerNotice },

  // 3. 인증 관련 서식
  forms: { 
    title: "인증 관련 서식", 
    description: "인증 신청에 필요한 각종 서식을 다운로드하세요.", 
    showAttachment: true,
    banner: BannerNotice 
  },

  // 4. 게시판
  notice: { 
    title: "공지사항", 
    description: "중요한 소식과 안내사항을 전해드립니다.", 
    banner: BannerNotice 
  },
  qna: { 
    title: "문의상담", 
    description: "궁금하신 점을 남겨주시면 답변해 드립니다.", 
    banner: BannerQnA 
  },

  // 5. 자료실
  archive: { 
    title: "자료실", 
    description: "학술 자료 및 기술 데이터를 확인하실 수 있습니다.", 
    showAttachment: true,
    banner: BannerArchive 
  },
};

// ... 이하 Notice 컴포넌트 본문 (이전 답변과 동일)

const Notice = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const currentBoard = boardSettings[category] || boardSettings.notice;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
        <main className="flex-grow">
          {/* 1. 배너 섹션: 높이를 h-[320px]에서 h-[200px] 정도로 줄입니다. */}
          <section className="max-w-[900px] mx-auto pt-4 pb-4 px-4 text-center">
            <h2 className="text-3xl font-extrabold text-gray-950 mb-2 tracking-tight">
              {currentBoard.title}
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-2">
              {currentBoard.description}
            </p>

            {/* 이미지 프레임: h-[200px]~[250px]로 줄이면 상하 폭이 슬림해집니다. */}
            <div className="w-full h-[180px] rounded-3xl overflow-hidden shadow-md border-4 border-white">
              <img 
                src={currentBoard.banner} 
                alt={currentBoard.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </section>

          {/* 2. 게시판 섹션: 배너 바로 아래에 오도록 py-16을 py-8 정도로 조절합니다. */}
          <section className="py-2">
            <div className="max-w-[900px] mx-auto px-4">
              <div className="overflow-x-auto">
                <table className="w-full border-t-2 border-gray-800">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                      <th className="py-4 w-20 text-center">번호</th>
                      <th className="py-4 px-4 text-left">제목</th>
                      {currentBoard.showAttachment && <th className="py-4 w-20 text-center">첨부</th>}
                      <th className="py-4 w-28 text-center">작성자</th>
                      <th className="py-4 w-28 text-center">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 게시물 데이터가 나오는 곳 */}
                    {[1, 2, 3].map((num) => (
                      <tr key={num} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <td className="py-4 text-center text-gray-400 text-sm">{num}</td>
                        <td className="py-4 px-4 font-medium text-gray-800">
                          {currentBoard.title}의 {num}번째 게시물입니다.
                        </td>
                        {currentBoard.showAttachment && (
                          <td className="py-4 text-center">💾</td>
                        )}
                        <td className="py-4 text-center text-sm text-gray-600">관리자</td>
                        <td className="py-4 text-center text-sm text-gray-500">2026.04.08</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 글쓰기 버튼 */}
              <div className="mt-6 flex justify-end">
                <button 
                  className="px-6 py-2 bg-[#317F81] text-white font-bold rounded-lg hover:bg-[#256062] transition-colors"
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