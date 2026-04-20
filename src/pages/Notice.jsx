import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client'; 

import BannerAd from '../assets/banner/Advertising.webp'; 
import BannerArchive from '../assets/banner/Archive.webp'; 
import BannerBook from '../assets/banner/Book.webp'; 
import BannerTalk from '../assets/banner/converstation.webp'; 
import BannerNotice from '../assets/banner/Notice.webp'; 
import BannerQnA from '../assets/banner/QnA.webp'; 
import BannerWorkers from '../assets/banner/workers.webp'; 
import BannerManufacturing from '../assets/banner/Manufacturing.webp'; 
import BannerConstruction from '../assets/banner/Construction.webp'; 
import BannerConsulting from '../assets/banner/Consulting.webp'; 

const boardSettings = {
  edu: { title: "교육/세미나", description: "관련 교육 및 세미나 일정을 안내합니다.", banner: BannerTalk },
  publish: { title: "논문/출판", description: "연구 논문 및 출판 자료입니다.", banner: BannerBook },
  pr: { title: "홍보", description: "기관의 홍보 자료를 확인하세요.", banner: BannerAd },
  manufacture: { title: "제조업체 정보", description: "BF 인증 관련 제조업체 정보입니다.", banner: BannerManufacturing },
  construction: { title: "시공업체 정보", description: "BF 인증 관련 시공업체 정보입니다.", banner: BannerConstruction },
  consulting: { title: "컨설팅업체 정보", description: "BF 인증 관련 컨설팅업체 정보입니다.", banner: BannerConsulting },
  forms: { title: "인증 관련 서식", description: "인증에 필요한 서식 자료실입니다.", banner: BannerNotice },
  notice: { title: "공지사항", description: "사람과건축의 새로운 소식을 알려드립니다.", banner: BannerNotice },
  qna: { title: "문의상담", description: "궁금하신 점을 자유롭게 남겨주세요.", banner: BannerQnA },
  archive: { title: "자료실", description: "각종 유용한 자료를 내려받으실 수 있습니다.", banner: BannerArchive },
  // ⭐ 여기에 'search' 설정을 추가해서 공지사항으로 빠지지 않게 막습니다!
  search: { title: "통합 검색 결과", description: "입력하신 검색어와 일치하는 게시글 목록입니다.", banner: BannerArchive },
};

const Notice = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const globalQuery = searchParams.get('q') || "";

  const currentBoard = boardSettings[category] || boardSettings.notice;
  const { data: session } = authClient.useSession();

  const [posts, setPosts] = useState([]);      
  const [totalCount, setTotalCount] = useState(0); 
  const [loading, setLoading] = useState(true);   
  
  const [searchTerm, setSearchTerm] = useState(category === 'search' ? globalQuery : "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (category === 'search') {
      setSearchTerm(globalQuery);
      setCurrentPage(1);
    }
  }, [globalQuery, category]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const url = `/api/board?category=${category}&page=${currentPage}&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setPosts(data.posts || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category, currentPage, searchTerm]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const isQnA = category === 'qna';
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  // ⭐ 통합검색 결과창에서는 '글쓰기' 버튼을 아예 숨깁니다.
  const canWrite = category !== 'search' && (isQnA ? true : hasManagerRole);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <section className="max-w-[900px] mx-auto pt-4 pb-4 px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white mb-2 tracking-tight transition-colors">
            {/* ⭐ 검색어가 있으면 'ㅇㅇㅇ 검색 결과' 라고 더 친절하게 띄워줍니다. */}
            {category === 'search' && globalQuery ? `'${globalQuery}' 검색 결과` : currentBoard.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 transition-colors">
            {currentBoard.description}
          </p>
          <div className="w-full h-[180px] rounded-3xl overflow-hidden shadow-md dark:shadow-none border border-transparent dark:border-gray-800 transition-colors">
            <img src={currentBoard.banner} alt={currentBoard.title} className="w-full h-full object-cover" />
          </div>
        </section>

        <section className="py-2">
          <div className="max-w-[900px] mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
                총 <span className="text-[#317F81] dark:text-[#4fd1d5] font-bold">{totalCount}</span>건
              </div>
              <input
                type="text"
                placeholder="결과 내 재검색..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-64 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:border-[#317F81] dark:focus:border-[#4fd1d5] transition-colors"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-t-2 border-gray-800 dark:border-gray-600 transition-colors">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">
                    <th className="py-4 w-16 text-center">번호</th>
                    <th className="py-4 px-4 text-left">제목</th>
                    <th className="py-4 w-20 text-center">첨부</th>
                    <th className="py-4 w-24 text-center">작성자</th>
                    <th className="py-4 w-28 text-center">날짜</th>
                    <th className="py-4 w-16 text-center">조회</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="py-20 text-center text-gray-400 dark:text-gray-500">데이터를 불러오는 중...</td></tr>
                  ) : posts.length > 0 ? (
                    posts.map((post, index) => {
                      const displayNumber = totalCount - ((currentPage - 1) * itemsPerPage) - index;
                      const hasImage = post.image_url && post.image_url !== "" && post.image_url !== "[]" && post.image_url !== '""';
                      
                      // ⭐ 통합 검색에서 클릭 시, 해당 글이 작성된 '원래 카테고리'로 이동시킵니다!
                      const targetCategory = category === 'search' ? post.category : category;

                      return (
                        <tr 
                          key={post.id} 
                          onClick={() => navigate(`/board/${targetCategory}/${post.id}`)} 
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <td className="py-4 text-center text-gray-400 dark:text-gray-500 text-sm font-bold">{displayNumber}</td>
                          <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-200">
                            {/* ⭐ 검색 결과일 경우 제목 앞에 [게시판 이름]을 붙여주어 출처를 알려줍니다. */}
                            {category === 'search' && <span className="text-[11px] text-[#317F81] dark:text-[#4fd1d5] border border-[#317F81] dark:border-[#4fd1d5] px-1.5 py-0.5 rounded mr-2 align-middle">{boardNames[post.category] || '게시판'}</span>}
                            {post.title}
                          </td>
                          
                          <td className="py-4 text-center text-lg flex items-center justify-center gap-1">
                            {post.has_file === 1 && <span title="첨부파일">💾</span>}
                            {hasImage && <span title="사진 포함">🖼️</span>}
                          </td>
                          
                          <td className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                            {post.category === 'qna' ? post.author_name : '관리자'}
                          </td>

                          <td className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</td>
                          <td className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">{post.views || 0}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={6} className="py-20 text-center text-gray-500 dark:text-gray-400">등록된 게시물이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="w-24"></div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-colors ${
                      currentPage === pageNum 
                        ? "bg-[#317F81] text-white dark:bg-[#4fd1d5] dark:text-gray-900" 
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
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