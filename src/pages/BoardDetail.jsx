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

// ⭐ 계급 척도 정의
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

  // 1. 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 font-bold">데이터를 불러오는 중입니다...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. 게시글 없음
  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <span className="text-5xl mb-4">📂</span>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-2">게시글을 찾을 수 없습니다.</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">주소가 잘못되었거나 삭제된 게시물일 수 있습니다.</p>
          <button onClick={() => navigate(`/board/${category}`)} className="px-6 py-2 bg-[#317F81] hover:bg-[#256062] text-white font-bold rounded-lg transition-colors">
            게시판 목록으로 돌아가기
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ⭐ 3. 열람 권한 검사
  const requiredLevel = post.access_level || 0;
  const myLevel = session?.user?.role ? (ROLE_LEVELS[session.user.role] || 1) : 0;

  if (requiredLevel > myLevel) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <span className="text-6xl mb-6">🔒</span>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-3">
            접근 권한이 없습니다
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
            {requiredLevel === 1 
              ? "이 게시물은 로그인을 한 회원만 열람할 수 있습니다. 상단 메뉴에서 로그인해 주세요." 
              : "이 게시물은 '우수 회원' 이상만 열람할 수 있는 제한된 자료입니다."}
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
          >
            이전 페이지로 돌아가기
          </button>
        </main>
        <Footer />
      </div>
    );
  }


  // ⭐ 핵심 수정: 수정/삭제 권한 방어막 강화
  const isQnA = category === 'qna';
  // 게시글 작성자 이름과 현재 로그인한 유저 이름이 같은지 확인
  const isAuthor = session?.user?.name === post.author_name; 
  // 레벨 3(운영진) 이상인지 확인
  const hasManagerRole = myLevel >= 3; 

  // [수정/삭제 가능 조건] 
  // 1. 내가 운영진 이상(레벨 3 이상)이거나,
  // 2. 현재 게시판이 '문의상담(qna)' 이면서, 동시에 내가 쓴 글일 때만 허용!
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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[900px] mx-auto px-4">
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-extrabold text-[#317F81] dark:text-[#4fd1d5] bg-[#eef6f6] dark:bg-gray-700 px-2 py-1 rounded mr-2">
                {boardNames[category]}
              </span>
              {requiredLevel > 0 && (
                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                  {requiredLevel === 1 ? "🔒 일반 회원 공개" : "🔒 우수 회원 전용"}
                </span>
              )}

              <h1 className="text-2xl font-extrabold mt-3 mb-4 text-gray-900 dark:text-white">{post.title}</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4 items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">👤 {displayAuthor}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-gray-400 before:content-['|'] before:mr-3 before:text-gray-300 dark:before:text-gray-600">
                  👀 조회 {post.views || 0}
                </span>
              </div>
            </div>

            <div className="px-8 py-10 min-h-[200px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex justify-center">
                  <img src={url} alt={`첨부이미지`} className="max-w-full max-h-[700px] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 object-contain" />
                </div>
              ))}
              
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>

            {fileUrls.length > 0 && (
              <div className="px-8 py-6 bg-blue-50 dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700">
                <h3 className="text-sm font-extrabold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
                  💾 첨부된 자료 다운로드 ({fileUrls.length}개)
                </h3>
                <div className="flex flex-col gap-3">
                  {fileUrls.map((url, idx) => {
                    const originalName = decodeURIComponent(url.split('/').pop().split('-').slice(1).join('-')) || `첨부파일_${idx + 1}`;
                    const ext = originalName.split('.').pop().toUpperCase();
                    return (
                      <div key={idx} className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-xl border border-blue-200 dark:border-gray-600 shadow-sm hover:border-blue-400 transition-all gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="min-w-10 w-10 h-10 bg-blue-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-blue-700 dark:text-blue-400"><span className="font-bold text-[10px]">{ext}</span></div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{originalName}</span>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">내려받기</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              {post.nextPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.nextPost.id}`)}
                  className="flex items-center px-8 py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-sm font-extrabold text-[#317F81] dark:text-[#4fd1d5] w-20">▲ 다음글</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white truncate">{post.nextPost.title}</span>
                </div>
              )}
              {post.prevPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.prevPost.id}`)}
                  className="flex items-center px-8 py-4 cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-sm font-extrabold text-gray-400 w-20">▼ 이전글</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white truncate">{post.prevPost.title}</span>
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => navigate(`/board/${category}`)} className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">목록으로</button>
            {/* ⭐ 조건에 부합할 때만 노출! */}
            {canEditOrDelete && (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/board/${category}/edit/${post.id}`)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">수정</button>
                <button onClick={handleDelete} className="px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">삭제</button>
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