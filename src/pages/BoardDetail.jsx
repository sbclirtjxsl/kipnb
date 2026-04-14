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

  // DB에 저장된 사진 주소 배열로 풀기
  let imageUrls = [];
  if (post.image_url) {
    try { imageUrls = post.image_url.startsWith('[') ? JSON.parse(post.image_url) : [post.image_url]; } 
    catch (e) { imageUrls = [post.image_url]; }
  }

  // ⭐ DB에 저장된 여러 일반 자료(파일) 주소 배열로 풀기!
  let fileUrls = [];
  if (post.file_url) {
    try { fileUrls = post.file_url.startsWith('[') ? JSON.parse(post.file_url) : [post.file_url]; } 
    catch (e) { fileUrls = [post.file_url]; }
  }

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

            <div className="px-8 py-10 min-h-[300px] text-gray-800 leading-relaxed whitespace-pre-wrap">
              {/* 사진들 출력 */}
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex justify-center">
                  <img src={url} alt={`첨부이미지`} className="max-w-full max-h-[700px] rounded-xl shadow-sm border border-gray-200 object-contain" />
                </div>
              ))}
              {post.content}
            </div>

            {/* ⭐ 첨부 파일(자료)이 여러 개일 때 목록으로 띄워주기 */}
            {fileUrls.length > 0 && (
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                  📎 첨부파일 ({fileUrls.length}개)
                </h3>
                <div className="flex flex-col gap-3">
                  {fileUrls.map((url, idx) => {
                    // 원본 파일 이름 추출하는 로직 (타임스탬프 떼어내기)
                    const originalName = decodeURIComponent(url.split('/').pop().split('-').slice(1).join('-')) || `첨부파일_${idx + 1}`;
                    const ext = originalName.split('.').pop().toUpperCase();
                    
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#317F81] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#eef6f6] rounded-lg flex items-center justify-center text-[#317F81]">
                            <span className="font-bold text-xs">{ext}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[400px]">
                            {originalName}
                          </span>
                        </div>
                        <a 
                          href={url} 
                          download={originalName}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#317F81] text-white text-sm font-bold rounded-lg hover:bg-[#256062] transition-colors"
                        >
                          다운로드
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