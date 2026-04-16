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

        // 1. 내 브라우저(로컬스토리지)에 이 글을 읽었다는 도장이 있는지 확인!
        const viewedKey = `viewed_post_${category}_${id}`;
        const hasViewed = localStorage.getItem(viewedKey);

        // 2. 기본 요청 주소
        let fetchUrl = `/api/board-detail?id=${id}`;

        // 3. 도장이 없다면? 조회수를 올리라고 신호를 붙이고, 내 브라우저에 도장을 찍음!
        if (!hasViewed) {
          fetchUrl += '&increment=true';
          localStorage.setItem(viewedKey, 'true'); 
        }

        const response = await fetch(fetchUrl);
        if (response.ok) {
          setPost(await response.json());
        } else {
          navigate(`/board/${category}`); 
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id, category, navigate]); 

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return; 
    try {
      const response = await fetch(`/api/board-delete?id=${post.id}`, { method: 'DELETE' });
      if (response.ok) {
        alert("삭제되었습니다.");
        navigate(`/board/${category}`);
      } else {
        alert(`삭제 실패`);
      }
    } catch (error) {
      alert("오류 발생");
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">불러오는 중...</div>;
  if (!post) return null; 

  const isAuthor = session?.user?.name === post.author_name;
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canEditOrDelete = isAuthor || hasManagerRole;

  // ⭐ 작성자 이름 '관리자' 통일 로직 (QnA 제외)
  const isQnA = category === 'qna';
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
    // ⭐ 다크모드 배경색 적용 (bg-[#f8f9fa] -> dark:bg-gray-900)
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[900px] mx-auto px-4">
          
          {/* ⭐ 본문 카드 다크모드 적용 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-extrabold text-[#317F81] dark:text-[#4fd1d5] bg-[#eef6f6] dark:bg-gray-700 px-2 py-1 rounded">{boardNames[category]}</span>
              <h1 className="text-2xl font-extrabold mt-3 mb-4 text-gray-900 dark:text-white">{post.title}</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4 items-center">
                {/* ⭐ 작성자 이름 적용 */}
                <span className="font-bold text-gray-700 dark:text-gray-300">👤 {displayAuthor}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500 before:content-['|'] before:mr-3 before:text-gray-300 dark:before:text-gray-600">
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
              
              {/* ⭐ Quill 에디터의 HTML 태그를 해석해서 보여주는 핵심 마법! */}
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>

            {fileUrls.length > 0 && (
              <div className="px-8 py-6 bg-blue-50 dark:bg-gray-700/50 border-t border-blue-100 dark:border-gray-700">
                <h3 className="text-sm font-extrabold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  💾 첨부된 자료 다운로드 ({fileUrls.length}개)
                </h3>
                <div className="flex flex-col gap-3">
                  {fileUrls.map((url, idx) => {
                    const originalName = decodeURIComponent(url.split('/').pop().split('-').slice(1).join('-')) || `첨부파일_${idx + 1}`;
                    const ext = originalName.split('.').pop().toUpperCase();
                    return (
                      <div key={idx} className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-200 dark:border-gray-600 shadow-sm hover:border-blue-400 dark:hover:border-blue-400 hover:shadow transition-all gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="min-w-10 w-10 h-10 bg-blue-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-blue-700 dark:text-blue-300"><span className="font-bold text-[10px]">{ext}</span></div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{originalName}</span>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">내려받기</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ⭐ 이전글/다음글 다크모드 적용 */}
            <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
              {post.nextPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.nextPost.id}`)}
                  className="flex items-center px-8 py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-sm font-extrabold text-[#317F81] dark:text-[#4fd1d5] w-20">▲ 다음글</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{post.nextPost.title}</span>
                </div>
              )}
              {post.prevPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.prevPost.id}`)}
                  className="flex items-center px-8 py-4 cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-sm font-extrabold text-gray-400 dark:text-gray-500 w-20">▼ 이전글</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{post.prevPost.title}</span>
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => navigate(`/board/${category}`)} className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">목록으로</button>
            {canEditOrDelete && (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/board/${category}/edit/${post.id}`)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">수정</button>
                <button onClick={handleDelete} className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">삭제</button>
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