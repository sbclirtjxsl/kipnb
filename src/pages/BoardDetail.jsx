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
        const response = await fetch(`/api/board-detail?id=${id}`);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">불러오는 중...</div>;
  if (!post) return null; 

  const isAuthor = session?.user?.name === post.author_name;
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canEditOrDelete = isAuthor || hasManagerRole;

  let imageUrls = [];
  if (post.image_url) {
    try { imageUrls = post.image_url.startsWith('[') ? JSON.parse(post.image_url) : [post.image_url]; } 
    catch (e) { imageUrls = [post.image_url]; }
  }

  // ⭐ 파일 주소 배열 파싱
  let fileUrls = [];
  if (post.file_url) {
    try { fileUrls = post.file_url.startsWith('[') ? JSON.parse(post.file_url) : [post.file_url]; } 
    catch (e) { fileUrls = [post.file_url]; }
  }

  // 파일 주소가 빈 문자열("")인 경우 배열에서 제거하는 안전장치
  fileUrls = fileUrls.filter(url => url && url.trim() !== "");

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[900px] mx-auto px-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <span className="text-xs font-extrabold text-[#317F81] bg-[#eef6f6] px-2 py-1 rounded">{boardNames[category]}</span>
              <h1 className="text-2xl font-extrabold mt-3 mb-4">{post.title}</h1>
              <div className="text-sm text-gray-500 flex gap-4">
                <span className="font-medium text-gray-700">{post.author_name}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="px-8 py-10 min-h-[200px] text-gray-800 leading-relaxed whitespace-pre-wrap">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex justify-center">
                  <img src={url} alt={`첨부이미지`} className="max-w-full max-h-[700px] rounded-xl shadow-sm border border-gray-200 object-contain" />
                </div>
              ))}
              {post.content}
            </div>

            {/* ⭐ 명확하고 큰 다운로드 영역 */}
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
                          <div className="min-w-10 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                            <span className="font-bold text-[10px]">{ext}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-700 truncate">
                            {originalName}
                          </span>
                        </div>
                        {/* 확실하게 동작하는 다운로드 링크 (새 창 열기 보장) */}
                        <a 
                          href={url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          내려받기
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => navigate(`/board/${category}`)} className="px-6 py-2 bg-gray-100 font-bold rounded-lg hover:bg-gray-200">목록으로</button>
            {canEditOrDelete && (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/board/${category}/edit/${post.id}`)} className="px-4 py-2 border font-bold rounded-lg hover:bg-gray-50">수정</button>
                <button onClick={handleDelete} className="px-4 py-2 border border-red-200 text-red-500 font-bold rounded-lg hover:bg-red-50">삭제</button>
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