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

  if (loading) return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-gray-500">불러오는 중...</div>;
  if (!post) return null; 

  const isAuthor = session?.user?.name === post.author_name;
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canEditOrDelete = isAuthor || hasManagerRole;

  // 작성자 이름 로직 (QnA 제외 관리자 고정)
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
    // ⭐ 바깥 배경을 밝은 회색(#f8f9fa)으로 고정하여 종이 같은 느낌 부여
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[900px] mx-auto px-4">
          
          {/* ⭐ 본문 카드 배경을 완전한 흰색(bg-white)으로 고정 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <span className="text-xs font-extrabold text-[#317F81] bg-[#eef6f6] px-2 py-1 rounded">{boardNames[category]}</span>
              <h1 className="text-2xl font-extrabold mt-3 mb-4 text-gray-900">{post.title}</h1>
              <div className="text-sm text-gray-500 flex gap-4 items-center">
                <span className="font-bold text-gray-700">👤 {displayAuthor}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-gray-400 before:content-['|'] before:mr-3 before:text-gray-300">
                  👀 조회 {post.views || 0}
                </span>
              </div>
            </div>

            <div className="px-8 py-10 min-h-[200px] text-gray-800 leading-relaxed whitespace-pre-wrap">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex justify-center">
                  <img src={url} alt={`첨부이미지`} className="max-w-full max-h-[700px] rounded-xl shadow-sm border border-gray-200 object-contain" />
                </div>
              ))}
              
              {/* Quill 에디터의 HTML 렌더링 영역 */}
              <div 
                className="prose max-w-none text-gray-800" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>

            {fileUrls.length > 0 && (
              <div className="px-8 py-6 bg-blue-50 border-t border-blue-100">
                <h3 className="text-sm font-extrabold text-blue-900 mb-4 flex items-center gap-2">
                  💾 첨부된 자료 다운로드 ({fileUrls.length}개)
                </h3>
                <div className="flex flex-col gap-3">
                  {fileUrls.map((url, idx) => {
                    const originalName = decodeURIComponent(url.split('/').pop().split('-').slice(1).join('-')) || `첨부파일_${idx + 1}`;
                    const ext = originalName.split('.').pop().toUpperCase();
                    return (
                      <div key={idx} className="flex flex-wrap items-center justify-between bg-white p-4 rounded-xl border border-blue-200 shadow-sm hover:border-blue-400 hover:shadow transition-all gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="min-w-10 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700"><span className="font-bold text-[10px]">{ext}</span></div>
                          <span className="text-sm font-bold text-gray-700 truncate">{originalName}</span>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">내려받기</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 bg-gray-50/50">
              {post.nextPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.nextPost.id}`)}
                  className="flex items-center px-8 py-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors group"
                >
                  <span className="text-sm font-extrabold text-[#317F81] w-20">▲ 다음글</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black">{post.nextPost.title}</span>
                </div>
              )}
              {post.prevPost && (
                <div 
                  onClick={() => navigate(`/board/${category}/${post.prevPost.id}`)}
                  className="flex items-center px-8 py-4 cursor-pointer hover:bg-white transition-colors group"
                >
                  <span className="text-sm font-extrabold text-gray-400 w-20">▼ 이전글</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black">{post.prevPost.title}</span>
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => navigate(`/board/${category}`)} className="px-6 py-2 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors">목록으로</button>
            {canEditOrDelete && (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/board/${category}/edit/${post.id}`)} className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">수정</button>
                <button onClick={handleDelete} className="px-4 py-2 border border-red-200 text-red-500 font-bold rounded-lg hover:bg-red-50 transition-colors">삭제</button>
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