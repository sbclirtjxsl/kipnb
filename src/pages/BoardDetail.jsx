import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client'; 

const boardNames = {
  edu: "교육/세미나", publish: "논문/출판", pr: "홍보",
  manufacture: "제조업체 정보", construction: "시공업체 정보", consulting: "컨설팅업체 정보",
  forms: "인증 관련 서식", notice: "공지사항", qna: "문의상담", archive: "자료실",
};

const ROLE_LEVELS = {
  '최고 관리자': 5,
  '관리자': 4,
  '운영진': 3,
  '우수 회원': 2,
  '일반 회원': 1
};

const BoardDetail = () => {
  const { category, id } = useParams(); 
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true); 

        const viewedKey = `viewed_post_${category}_${id}`;
        const hasViewed = localStorage.getItem(viewedKey);

        let fetchUrl = `/api/board-detail?id=${id}`;

        if (!hasViewed) {
          fetchUrl += '&increment=true';
          localStorage.setItem(viewedKey, 'true'); 
        }

        const response = await fetch(fetchUrl);
        if (response.ok) {
          setPost(await response.json());
        } else {
          setPost(null); 
        }
      } catch (error) {
        console.error(error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id, category]); 

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return; 
    try {
      const response = await fetch(`/api/board-delete?id=${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        alert("삭제되었습니다.");
        navigate(`/board/${category}`);
      } else {
        const errData = await response.json();
        alert(`삭제 실패: ${errData.error}`);
      }
    } catch (error) {
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  // 1. 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-txt-muted font-bold">데이터를 불러오는 중입니다...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. 게시글 없음
  if (!post) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <span className="text-5xl mb-4">📂</span>
          <h2 className="text-2xl font-extrabold text-txt-primary mb-2">게시글을 찾을 수 없습니다.</h2>
          <p className="text-txt-secondary mb-6">주소가 잘못되었거나 삭제된 게시물일 수 있습니다.</p>
          <button onClick={() => navigate(`/board/${category}`)} className="px-6 py-2 bg-brand-main hover:bg-brand-dark text-white font-bold rounded-lg transition-colors">
            게시판 목록으로 돌아가기
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const myLevel = session?.user?.role ? (ROLE_LEVELS[session.user.role] || 1) : 0;
  
  const isAuthor = session?.user?.email 
    ? session.user.email === post.author_email 
    : session?.user?.name === post.author_name; 
    
  const hasManagerRole = myLevel >= 3; 

  // ⭐ 방어막 1: 열람 권한(access_level) 등급 검사
  const requiredLevel = post.access_level || 0;
  if (requiredLevel > myLevel) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <span className="text-6xl mb-6">🔒</span>
          <h2 className="text-2xl font-extrabold text-txt-primary mb-3">
            접근 권한이 없습니다
          </h2>
          <p className="text-txt-secondary mb-8 max-w-sm leading-relaxed">
            {requiredLevel === 1 
              ? "이 게시물은 로그인을 한 회원만 열람할 수 있습니다. 상단 메뉴에서 로그인해 주세요." 
              : "이 게시물은 '우수 회원' 이상만 열람할 수 있는 제한된 자료입니다."}
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-8 py-3 bg-bg-surface hover:bg-bg-surface-hover text-txt-primary border border-bd-default font-bold rounded-xl transition-all"
          >
            이전 페이지로 돌아가기
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ⭐ 방어막 2: 비밀글(is_secret) 검사
  if (post.is_secret === 1 && !isAuthor && !hasManagerRole) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <span className="text-6xl mb-6">🔒</span>
          <h2 className="text-2xl font-extrabold text-txt-primary mb-3">
            비밀글입니다
          </h2>
          <p className="text-txt-secondary mb-8 max-w-sm leading-relaxed">
            해당 게시물은 작성자 본인과 운영진만 열람할 수 있습니다.
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-8 py-3 bg-bg-surface hover:bg-bg-surface-hover text-txt-primary border border-bd-default font-bold rounded-xl transition-all"
          >
            이전 페이지로 돌아가기
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const isQnA = category === 'qna';
  const canEditOrDelete = hasManagerRole || (isQnA && isAuthor);
  const displayAuthor = isQnA ? post.author_name : '관리자';

  let imageUrls = [];
  if (post.image_url) {
    try { imageUrls = post.image_url.startsWith('[') ? JSON.parse(post.image_url) : [post.image_url]; } 
    catch (e) { imageUrls = [post.image_url]; }
  }

  let fileUrls = [];
  if (post.file_url) {
    try { fileUrls = post.file_url.startsWith('[') ? JSON.parse(post.file_url) : [post.file_url]; } 
    catch (e) { fileUrls = [post.file_url]; }
  }
  fileUrls = fileUrls.filter(url => url && url.trim() !== "");

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[900px] mx-auto px-4">
          
          {/* 게시글 본문 컨테이너 */}
          <div className="bg-bg-surface rounded-2xl shadow-sm border border-bd-default overflow-hidden transition-colors">
            
            {/* 게시글 헤더 영역 */}
            <div className="px-8 py-6 border-b border-bd-default">
              <span className="text-xs font-extrabold text-brand-main bg-brand-main/10 border border-brand-main/20 px-2 py-1 rounded mr-2">
                {boardNames[category]}
              </span>
              
              {requiredLevel > 0 && (
                <span className="text-xs font-bold text-red-500 bg-red-50/50 border border-red-200 px-2 py-1 rounded">
                  {requiredLevel === 1 ? "🔒 일반 회원 공개" : "🔒 우수 회원 전용"}
                </span>
              )}
              
              {post.is_secret === 1 && (
                <span className="text-xs font-bold text-txt-secondary bg-bg-base border border-bd-default px-2 py-1 rounded ml-2">
                  🔒 비밀글
                </span>
              )}

              <h1 className="text-2xl font-extrabold mt-4 mb-4 text-txt-primary">{post.title}</h1>
              <div className="text-sm text-txt-secondary flex gap-4 items-center">
                <span className="font-bold text-txt-primary">👤 {displayAuthor}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-txt-muted before:content-['|'] before:mr-3 before:text-bd-default">
                  👀 조회 {post.views || 0}
                </span>
              </div>
            </div>

            {/* 게시글 내용 영역 */}
            <div className="px-8 py-10 min-h-[200px] text-txt-primary leading-relaxed whitespace-pre-wrap">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex justify-center">
                  <img src={url} alt={`첨부이미지`} className="max-w-full max-h-[700px] rounded-xl shadow-sm border border-bd-default object-contain" />
                </div>
              ))}
              
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>

            {/* 첨부파일 다운로드 영역 */}
            {fileUrls.length > 0 && (
              <div className="px-8 py-6 bg-bg-base border-t border-bd-default">
                <h3 className="text-sm font-extrabold text-txt-primary mb-4 flex items-center gap-2">
                  💾 첨부된 자료 다운로드 ({fileUrls.length}개)
                </h3>
                <div className="flex flex-col gap-3">
                  {fileUrls.map((url, idx) => {
                    const originalName = decodeURIComponent(url.split('/').pop().split('-').slice(1).join('-')) || `첨부파일_${idx + 1}`;
                    const ext = originalName.split('.').pop().toUpperCase();
                    return (
                      <div key={idx} className="flex flex-wrap items-center justify-between bg-bg-surface p-4 rounded-xl border border-bd-default shadow-sm hover:border-brand-main transition-all gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="min-w-10 w-10 h-10 bg-brand-main/10 border border-brand-main/20 rounded-lg flex items-center justify-center text-brand-main">
                            <span className="font-bold text-[10px]">{ext}</span>
                          </div>
                          <span className="text-sm font-bold text-txt-primary truncate">{originalName}</span>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap px-6 py-2.5 bg-brand-main text-white text-sm font-bold rounded-lg hover:bg-brand-dark shadow-sm transition-colors flex items-center gap-2">내려받기</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 이전글/다음글 네비게이션 */}
            <div className="border-t border-bd-default bg-bg-surface">
              {post.nextPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.nextPost.id}`)}
                  className="flex items-center px-8 py-4 border-b border-bd-default cursor-pointer hover:bg-bg-surface-hover transition-colors group"
                >
                  <span className="text-sm font-extrabold text-brand-main w-20">▲ 다음글</span>
                  <span className="text-sm font-medium text-txt-secondary group-hover:text-brand-main truncate transition-colors">{post.nextPost.title}</span>
                </div>
              )}
              {post.prevPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.prevPost.id}`)}
                  className="flex items-center px-8 py-4 cursor-pointer hover:bg-bg-surface-hover transition-colors group"
                >
                  <span className="text-sm font-extrabold text-txt-muted w-20">▼ 이전글</span>
                  <span className="text-sm font-medium text-txt-secondary group-hover:text-brand-main truncate transition-colors">{post.prevPost.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="mt-6 flex justify-between items-center">
            <button 
              onClick={() => navigate(`/board/${category}`)} 
              className="px-6 py-2 bg-bg-surface border border-bd-default text-txt-primary font-bold rounded-lg hover:bg-bg-surface-hover transition-colors"
            >
              목록으로
            </button>
            
            {canEditOrDelete && (
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/board/${category}/edit/${post.id}`)} 
                  className="px-4 py-2 bg-bg-base border border-bd-default text-txt-primary font-bold rounded-lg hover:bg-bg-surface-hover transition-colors"
                >
                  수정
                </button>
                <button 
                  onClick={handleDelete} 
                  className="px-4 py-2 border border-red-200 bg-red-50 text-red-500 font-bold rounded-lg hover:bg-red-100 transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoardDetail;