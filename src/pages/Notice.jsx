import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
};

const Notice = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const currentBoard = boardSettings[category] || boardSettings.notice;
  const { data: session } = authClient.useSession();

  const [posts, setPosts] = useState([]);      
  const [totalCount, setTotalCount] = useState(0); 
  const [loading, setLoading] = useState(true);   
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadPosts = async () => {
    setLoading(true);
    try {
      const url = `/api/board?category=${category}&page=${currentPage}&search=${searchTerm}`;
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
  const canWrite = isQnA ? true : hasManagerRole;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <section className="max-w-[900px] mx-auto pt-4 pb-4 px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-950 mb-2 tracking-tight">{currentBoard.title}</h2>
          <p className="text-gray-500 text-sm font-medium mb-2">{currentBoard.description}</p>
          <div className="w-full h-[180px] rounded-3xl overflow-hidden shadow-md border-4 border-white">
            <img src={currentBoard.banner} alt={currentBoard.title} className="w-full h-full object-cover" />
          </div>
        </section>

        <section className="py-2">
          <div className="max-w-[900px] mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500 font-medium">
                총 <span className="text-[#317F81] font-bold">{totalCount}</span>건
              </div>
              <input
                type="text"
                placeholder="제목으로 검색..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#317F81]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-t-2 border-gray-800">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                    <th className="py-4 w-16 text-center">번호</th>
                    <th className="py-4 px-4 text-left">제목</th>
                    {/* ⭐ 조건 없애고 모든 게시판에 첨부 열 표시 */}
                    <th className="py-4 w-20 text-center">첨부</th>
                    {/* <th className="py-4 w-24 text-center">작성자</th> */}
                    <th className="py-4 w-28 text-center">날짜</th>
                    {/* ⭐ 조회수 열 추가 */}
                    <th className="py-4 w-16 text-center">조회</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="py-20 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
                  ) : posts.length > 0 ? (
                    posts.map((post, index) => {
                      const displayNumber = totalCount - ((currentPage - 1) * itemsPerPage) - index;
                      
                      // 사진이 포함되어 있는지 확인 (빈 문자열이거나 빈 배열이 아닐 때)
                      const hasImage = post.image_url && post.image_url !== "" && post.image_url !== "[]" && post.image_url !== '""';

                      return (
                        <tr key={post.id} onClick={() => navigate(`/board/${category}/${post.id}`)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                          <td className="py-4 text-center text-gray-400 text-sm font-bold">{displayNumber}</td>
                          <td className="py-4 px-4 font-medium text-gray-800">{post.title}</td>
                          
                          {/* ⭐ 파일(💾)과 사진(🖼️) 아이콘을 나란히 표시 */}
                          <td className="py-4 text-center text-lg flex items-center justify-center gap-1">
                            {post.has_file === 1 && <span title="첨부파일">💾</span>}
                            {hasImage && <span title="사진 포함">🖼️</span>}
                          </td>
                          
                          <td className="py-4 text-center text-sm text-gray-600">{post.author_name}</td>
                          <td className="py-4 text-center text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                          {/* ⭐ 조회수 표시 */}
                          <td className="py-4 text-center text-sm text-gray-500">{post.views || 0}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={6} className="py-20 text-center text-gray-500">등록된 게시물이 없습니다.</td></tr>
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
                      currentPage === pageNum ? "bg-[#317F81] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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