import React, { useState, useEffect } from 'react'; // ⭐ useEffect, useState 추가
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

  // ⭐ 진짜 DB 데이터를 담을 바구니 (초기값은 비워둡니다)
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ DB에서 글 하나 불러오는 함수
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`/api/board-detail?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          alert("존재하지 않거나 삭제된 게시글입니다.");
          navigate(`/board/${category}`); // 에러 나면 목록으로 돌려보냄
        }
      } catch (error) {
        console.error("게시글 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id, category, navigate]);

  // 데이터를 불러오는 중일 때 보여줄 화면
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
        <Header />
        <main className="flex-grow py-20 flex items-center justify-center">
          <div className="text-gray-500 font-bold">게시글을 불러오는 중입니다...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // 글이 없을 때 (만약의 상황 대비)
  if (!post) return null; 

  // 권한 계산기 (작성자 본인인지, 관리자인지 확인)
  const isAuthor = session?.user?.name === post.author_name; // DB의 이름과 비교
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canEditOrDelete = isAuthor || hasManagerRole;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="max-w-[900px] mx-auto px-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-extrabold text-[#317F81] bg-[#eef6f6] px-2 py-1 rounded">
                  {boardNames[category] || category.toUpperCase()}
                </span>
                {/* 화면에 보여주는 번호는 가짜 번호 대신 실제 DB 고유번호(No.13)를 써도 무방합니다. */}
              </div>
              
              {/* ⭐ DB에서 가져온 진짜 제목 */}
              <h1 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {/* ⭐ DB에서 가져온 진짜 작성자와 날짜 */}
                  <span className="font-medium text-gray-700">{post.author_name}</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* (첨부파일은 나중에 R2 연동할 때 추가할 예정이므로 잠시 숨겨둡니다) */}

            {/* ⭐ DB에서 가져온 진짜 본문 내용 */}
            <div className="px-8 py-10 min-h-[300px] text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button 
              onClick={() => navigate(`/board/${category}`)}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              목록으로
            </button>

            {canEditOrDelete && (
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                  수정
                </button>
                <button className="px-4 py-2 border border-red-200 text-red-500 font-bold rounded-lg hover:bg-red-50 transition-colors">
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