import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client'; 

// 배너 이미지
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

const boardNames = {
  edu: "교육/세미나", publish: "논문/출판", pr: "홍보",
  manufacture: "제조업체 정보", construction: "시공업체 정보", consulting: "컨설팅업체 정보",
  forms: "인증 관련 서식", notice: "공지사항", qna: "문의상담", archive: "자료실",
};

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
  search: { title: "통합 검색 결과", description: "입력하신 검색어와 일치하는 게시글 목록입니다.", banner: BannerArchive },
};

// ⭐ 계급 척도 정의 (권한 제어용)
const ROLE_LEVELS = {
  '최고 관리자': 5,
  '관리자': 4,
  '운영진': 3,
  '우수 회원': 2,
  '일반 회원': 1
};

const Notice = () => {
  const { category = "notice" } = useParams();
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
    } else {
      setSearchTerm(""); 
    }
    setCurrentPage(1);
  }, [globalQuery, category]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const url = `/api/board?category=${category}&page=${currentPage}&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setTotalCount(Number(data.total) || 0);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setPosts([]); 
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category, currentPage, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage) || 1);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // ⭐ 내 계급 수치화 및 글쓰기 권한 부여 로직 변경
  // 로그인 안 한 상태면 0, 로그인 했으면 해당 계급의 레벨값 부여
  const myLevel = session?.user?.role ? (ROLE_LEVELS[session.user.role] || 1) : 0;
  
  const isQnA = category === 'qna';
  const hasManagerRole = myLevel >= 3; // ⭐ 레벨 3(운영진) 이상이면 무조건 true
  const canWrite = category !== 'search' && (isQnA ? true : hasManagerRole);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        {/* 상단 타이틀 및 배너 영역 */}
        <section className="max-w-[900px] mx-auto pt-10 pb-4 px-4 text-center">
          <h2 className="text-3xl font-extrabold text-txt-primary mb-4 tracking-tight">
            {category === 'search' && globalQuery ? `'${globalQuery}' 검색 결과` : currentBoard?.title}
          </h2>
          <p className="text-txt-secondary text-sm font-medium mb-4">
            {currentBoard?.description}
          </p>
          <div className="w-full h-[180px] rounded-3xl overflow-hidden shadow-sm ">
            {currentBoard?.banner && <img src={currentBoard.banner} alt="배너" className="w-full h-full object-cover dark:opacity-90" />}
          </div>
        </section>

        {/* 게시판 목록 영역 */}
        <section className="py-2">
          <div className="max-w-[900px] mx-auto px-4">
            
            {/* 검색 및 건수 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div className="text-sm text-txt-secondary font-medium">
                총 <span className="text-brand-main font-bold">{totalCount}</span>건
              </div>
              <input
                type="text"
                placeholder={category === 'search' ? "결과 내 재검색..." : "제목으로 검색..."}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-64 px-4 py-2 text-sm border border-bd-strong bg-bg-surface text-txt-primary placeholder-txt-muted rounded-lg focus:outline-none focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-colors"
              />
            </div>

            {loading ? (
               <div className="py-20 text-center text-txt-muted border-t-2 border-txt-primary">데이터를 불러오는 중...</div>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              <>
                {/* 1. 데스크탑용 테이블 레이아웃 */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-t-2 border-txt-primary">
                    <thead>
                      <tr className="bg-bg-surface border-b border-bd-default text-sm font-bold text-txt-primary">
                        <th className="py-4 w-16 text-center">번호</th>
                        <th className="py-4 px-4 text-left">제목</th>
                        <th className="py-4 w-20 text-center">첨부</th>
                        <th className="py-4 w-24 text-center">작성자</th>
                        <th className="py-4 w-28 text-center">날짜</th>
                        <th className="py-4 w-16 text-center">조회</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, index) => {
                        const displayNumber = totalCount - ((currentPage - 1) * itemsPerPage) - index;
                        const hasImage = post.image_url && post.image_url !== "" && post.image_url !== "[]" && post.image_url !== '""';
                        const targetCategory = category === 'search' ? (post.category || 'notice') : category;

                        return (
                          <tr 
                            key={post.id || index} 
                            onClick={() => navigate(`/board/${targetCategory}/${post.id}`)} 
                            className="border-b border-bd-subtle hover:bg-bg-surface-hover cursor-pointer transition-colors"
                          >
                            <td className="py-4 text-center text-txt-muted text-sm font-bold">{displayNumber || 0}</td>
                            <td className="py-4 px-4 font-medium text-txt-primary">
                              {category === 'search' && (
                                <span className="text-[11px] text-brand-main border border-brand-main px-1.5 py-0.5 rounded mr-2 align-middle">
                                  {boardNames[post.category] || '게시판'}
                                </span>
                              )}
                              {/* 비밀글 등 권한 자물쇠 표시 필요시 여기에 추가 가능 */}
                              {post.title || "제목 없음"}
                            </td>
                            <td className="py-4 text-center text-lg flex items-center justify-center gap-1">
                              {post.has_file === 1 && <span title="첨부파일">💾</span>}
                              {hasImage && <span title="사진 포함">🖼️</span>}
                            </td>
                            <td className="py-4 text-center text-sm text-txt-secondary">
                              {post.category === 'qna' ? (post.author_name || '익명') : '관리자'}
                            </td>
                            <td className="py-4 text-center text-sm text-txt-muted">
                              {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-4 text-center text-sm text-txt-muted">{post.views || 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 2. 모바일용 리스트 레이아웃 */}
                <div className="md:hidden border-t-2 border-txt-primary">
                  {posts.map((post, index) => {
                    const displayNumber = totalCount - ((currentPage - 1) * itemsPerPage) - index;
                    const hasImage = post.image_url && post.image_url !== "" && post.image_url !== "[]" && post.image_url !== '""';
                    const targetCategory = category === 'search' ? (post.category || 'notice') : category;

                    return (
                      <div 
                        key={post.id || index}
                        onClick={() => navigate(`/board/${targetCategory}/${post.id}`)}
                        className="py-4 border-b border-bd-subtle hover:bg-bg-surface-hover cursor-pointer flex flex-col gap-2"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-txt-muted mt-1 w-6 shrink-0">{displayNumber || 0}</span>
                          <h3 className="font-medium text-txt-primary leading-tight break-all">
                            {category === 'search' && (
                              <span className="inline-block text-[10px] text-brand-main border border-brand-main px-1 py-0.5 rounded mr-2 align-middle mb-1">
                                {boardNames[post.category] || '게시판'}
                              </span>
                            )}
                            {post.title || "제목 없음"}
                          </h3>
                        </div>
                        
                        <div className="flex justify-between items-center pl-8 text-[11px] text-txt-muted">
                          <div className="flex items-center gap-3">
                            <span>{post.category === 'qna' ? (post.author_name || '익명') : '관리자'}</span>
                            <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}</span>
                            <span>조회 {post.views || 0}</span>
                          </div>
                          <div className="flex gap-1 text-sm">
                            {post.has_file === 1 && <span>💾</span>}
                            {hasImage && <span>🖼️</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-txt-muted border-t-2 border-txt-primary">등록된 게시물이 없습니다.</div>
            )}

            {/* 페이지네이션 구역 */}
            {totalCount > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="hidden sm:block w-24"></div>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-colors ${
                        currentPage === pageNum 
                          ? "bg-brand-main text-txt-inverse" 
                          : "bg-bg-surface text-txt-secondary border border-bd-default hover:bg-bg-surface-hover"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <div className="w-full sm:w-24 flex justify-end">
                  {/* ⭐ 권한이 있는 경우 글쓰기 버튼 노출 */}
                  {canWrite && (
                    <button 
                      className="w-full sm:w-auto px-6 py-2 bg-brand-main text-txt-inverse font-bold rounded-lg hover:bg-brand-dark transition-colors"
                      onClick={() => navigate(`/board/${category}/write`)}
                    >
                      글쓰기
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* 데이터가 0개일 때 글쓰기 버튼 */}
            {totalCount === 0 && canWrite && (
              <div className="mt-6 flex justify-end">
                 <button 
                    className="w-full sm:w-auto px-6 py-2 bg-brand-main text-txt-inverse font-bold rounded-lg hover:bg-brand-dark transition-colors"
                    onClick={() => navigate(`/board/${category}/write`)}
                  >
                    글쓰기
                  </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Notice;