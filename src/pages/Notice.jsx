import React, { useState, useEffect } from 'react'; // ⭐ useEffect 추가
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client'; 

// 배너 이미지 생략 (기존 코드와 동일)
import BannerAd from '../assets/banner/Advertising.webp'; 
import BannerArchive from '../assets/banner/Archive.webp'; 
import BannerBook from '../assets/banner/Book.webp'; 
import BannerTalk from '../assets/banner/converstation.webp'; 
import BannerNotice from '../assets/banner/Notice.webp'; 
import BannerQnA from '../assets/banner/QnA.webp'; 
import BannerWorkers from '../assets/banner/workers.webp'; 

const boardSettings = {
  edu: { title: "교육/세미나", description: "...", banner: BannerTalk },
  publish: { title: "논문/출판", description: "...", showAttachment: true, banner: BannerBook },
  pr: { title: "홍보", description: "...", banner: BannerAd },
  manufacture: { title: "제조업체 정보", description: "...", banner: BannerNotice },
  construction: { title: "시공업체 정보", description: "...", banner: BannerNotice },
  consulting: { title: "컨설팅업체 정보", description: "...", banner: BannerNotice },
  forms: { title: "인증 관련 서식", description: "...", showAttachment: true, banner: BannerNotice },
  notice: { title: "공지사항", description: "...", banner: BannerNotice },
  qna: { title: "문의상담", description: "...", banner: BannerQnA },
  archive: { title: "자료실", description: "...", showAttachment: true, banner: BannerArchive },
};

const Notice = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const currentBoard = boardSettings[category] || boardSettings.notice;
  const { data: session } = authClient.useSession();

  // ⭐ 진짜 데이터를 저장할 바구니들
  const [posts, setPosts] = useState([]);      // 게시글 목록
  const [totalCount, setTotalCount] = useState(0); // 전체 글 개수
  const [loading, setLoading] = useState(true);   // 로딩 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ⭐ 데이터 불러오는 함수 (API 호출)
  const loadPosts = async () => {
    setLoading(true);
    try {
      // 위에서 만든 board.js API에 요청을 보냅니다.
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

  // ⭐ 카테고리, 페이지, 검색어가 바뀔 때마다 다시 불러오기
  useEffect(() => {
    loadPosts();
  }, [category, currentPage, searchTerm]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // 권한 체크
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
                    <th className="py-4 w-20 text-center">번호</th>
                    <th className="py-4 px-4 text-left">제목</th>
                    {currentBoard.showAttachment && <th className="py-4 w-16 text-center">첨부</th>}
                    <th className="py-4 w-24 text-center">작성자</th>
                    <th className="py-4 w-28 text-center">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
                  ) : posts.length > 0 ? (
                    // ⭐ map 함수에 'index(순서)'를 추가로 받아옵니다.
                    posts.map((post, index) => {
                      
                      // ⭐ 게시판별 가짜 번호 계산 공식! (전체 글 수 - 앞 페이지 글 수 - 현재 페이지 내 순서)
                      const displayNumber = totalCount - ((currentPage - 1) * itemsPerPage) - index;

                      return (
                        <tr key={post.id} onClick={() => navigate(`/board/${category}/${post.id}`)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                          
                          {/* ⭐ 화면에 보여주는 번호는 진짜 post.id가 아니라 계산한 displayNumber를 씁니다! */}
                          <td className="py-4 text-center text-gray-400 text-sm font-bold">{displayNumber}</td>
                          
                          <td className="py-4 px-4 font-medium text-gray-800">{post.title}</td>
                          {currentBoard.showAttachment && (
                            <td className="py-4 text-center text-gray-500 text-lg">{post.has_file ? "💾" : ""}</td>
                          )}
                          <td className="py-4 text-center text-sm text-gray-600">{post.author_name}</td>
                          <td className="py-4 text-center text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-500">등록된 게시물이 없습니다.</td></tr>
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