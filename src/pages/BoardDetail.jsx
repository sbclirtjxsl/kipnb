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
          const data = await response.json();
          setPost(data);
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

  // ⭐ DB에 저장된 주소를 사진 배열로 푸는 마법!
  let imageUrls = [];
  if (post.image_url) {
    try {
      // 새로운 다중 사진 (JSON 형식)일 경우
      if (post.image_url.startsWith('[')) {
        imageUrls = JSON.parse(post.image_url);
      } else {
        // 과거에 1장만 올렸던 단순 텍스트 주소일 경우
        imageUrls = [post.image_url];
      }
    } catch (e) {
      imageUrls = [post.image_url];
    }
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
              
              {/* ⭐ 배열에 담긴 사진들을 차례대로 세로로 출력합니다! */}
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex justify-center">
                  <img 
                    src={url} 
                    alt={`첨부이미지 ${index + 1}`} 
                    className="max-w-full max-h-[700px] rounded-xl shadow-sm border border-gray-200 object-contain"
                  />
                </div>
              ))}

              {post.content}
            </div>
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