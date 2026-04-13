import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import BannerAd from '../assets/banner/Advertising.webp'; 
import BannerArchive from '../assets/banner/Archive.webp'; 
import BannerBook from '../assets/banner/Book.webp'; 
import BannerTalk from '../assets/banner/converstation.webp'; 
import BannerNotice from '../assets/banner/Notice.webp'; 
import BannerQnA from '../assets/banner/QnA.webp'; 
import BannerWorkers from '../assets/banner/workers.webp'; 
import { authClient } from '../auth-client'; 

const boardSettings = {
  edu: { title: "교육/세미나", description: "진행 중인 교육 및 세미나 일정을 확인하세요.", banner: BannerTalk },
  publish: { title: "논문/출판", description: "연구 성과 및 관련 출판물 자료입니다.", showAttachment: true, banner: BannerBook },
  pr: { title: "홍보", description: "사람과건축의 대외 활동 및 홍보 자료입니다.", banner: BannerAd },
  manufacture: { title: "제조업체 정보", description: "관련 제조업체 정보를 제공합니다.", banner: BannerNotice },
  construction: { title: "시공업체 정보", description: "관련 시공업체 정보를 제공합니다.", banner: BannerNotice },
  consulting: { title: "컨설팅업체 정보", description: "관련 컨설팅업체 정보를 제공합니다.", banner: BannerNotice },
  forms: { title: "인증 관련 서식", description: "인증 신청에 필요한 각종 서식을 다운로드하세요.", showAttachment: true, banner: BannerNotice },
  notice: { title: "공지사항", description: "중요한 소식과 안내사항을 전해드립니다.", banner: BannerNotice },
  qna: { title: "문의상담", description: "궁금하신 점을 남겨주시면 답변해 드립니다.", banner: BannerQnA },
  archive: { title: "자료실", description: "학술 자료 및 기술 데이터를 확인하실 수 있습니다.", showAttachment: true, banner: BannerArchive },
};

// 💡 테스트를 위한 가짜 게시물 35개 생성 (나중에는 진짜 DB에서 가져옵니다!)
const dummyPosts = Array.from({ length: 35 }, (_, i) => ({
  id: 35 - i,
  title: `테스트 게시물 제목입니다. [${35 - i}]`,
  hasAttachment: i % 4 === 0, // 4번째 글마다 첨부파일 아이콘 표시
  author: i % 3 === 0 ? "운영진" : "관리자",
  date: "2026.04.13"
}));

const Notice = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const currentBoard = boardSettings[category] || boardSettings.notice;

  const { data: session } = authClient.useSession();
  // ⭐ 상태 관리 (검색어, 현재 페이지)
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10개씩

  const isQnA = category === 'qna';
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canWrite = isQnA ? true : hasManagerRole;

  // ⭐ 1. 검색어로 게시물 걸러내기 (필터링)
  const filteredPosts = dummyPosts.filter((post) =>
    post.title.includes(searchTerm)
  );

  // ⭐ 2. 페이지네이션 계산 (10개씩 자르기)
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  // 검색어 입력 시 첫 페이지로 돌려보내는 함수
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색하면 무조건 1페이지부터 다시 보기!
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
        <main className="flex-grow">
          {/* 배너 섹션 */}
          <section className="max-w-[900px] mx-auto pt-4 pb-4 px-4 text-center">
            <h2 className="text-3xl font-extrabold text-gray-950 mb-2 tracking-tight">
              {currentBoard.title}
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-2">
              {currentBoard.description}
            </p>
            <div className="w-full h-[180px] rounded-3xl overflow-hidden shadow-md border-4 border-white">
              <img src={currentBoard.banner} alt={currentBoard.title} className="w-full h-full object-cover" />
            </div>
          </section>

          {/* 게시판 섹션 */}
          <section className="py-2">
            <div className="max-w-[900px] mx-auto px-4">
              
              {/* ⭐ 검색창 영역 추가 */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500 font-medium">
                  총 <span className="text-[#317F81] font-bold">{filteredPosts.length}</span>건
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="제목으로 검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#317F81] focus:ring-1 focus:ring-[#317F81] transition-colors"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-t-2 border-gray-800">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                      <th className="py-4 w-20 text-center">번호</th>
                      <th className="py-4 px-4 text-left">제목</th>
                      {currentBoard.showAttachment && <th className="py-4 w-16 text-center">첨부</th>}
                      <th className="py-4 w-24 text-center">작성자</th>
                      <th className="py-4 w-28 text-center">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ⭐ 잘라낸 10개의 데이터(currentPosts)만 화면에 그립니다 */}
                    {currentPosts.length > 0 ? (
                      currentPosts.map((post) => (
                        <tr key={post.id} onClick={() => navigate(`/board/${category}/${post.id}`)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                          <td className="py-4 text-center text-gray-400 text-sm">{post.id}</td>
                          <td className="py-4 px-4 font-medium text-gray-800">{post.title}</td>
                          {currentBoard.showAttachment && (
                            <td className="py-4 text-center text-gray-500 text-lg">
                              {post.hasAttachment ? "💾" : ""}
                            </td>
                          )}
                          <td className="py-4 text-center text-sm text-gray-600">{post.author}</td>
                          <td className="py-4 text-center text-sm text-gray-500">{post.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 하단 영역: 페이지네이션 & 글쓰기 버튼 */}
              <div className="mt-6 flex items-center justify-between">
                {/* 왼쪽 빈 공간 (가운데 정렬을 위해) */}
                <div className="w-24"></div>

                {/* ⭐ 페이지네이션 버튼들 */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-colors ${
                        currentPage === pageNum
                          ? "bg-[#317F81] text-white" // 현재 페이지 색상
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* 글쓰기 버튼 */}
                <div className="w-24 flex justify-end">
                  {canWrite && (
                    <button 
                      className="px-6 py-2 bg-[#317F81] text-white font-bold rounded-lg hover:bg-[#256062] transition-colors"
                      onClick={() => navigate(`/board/${category}/write`)}
                    >
                      글쓰기
                    </button>
                  )}
                </div>
              </div>

            </div>
          </section>
        </main>

      <Footer />
    </div>
  );
};

export default Notice;