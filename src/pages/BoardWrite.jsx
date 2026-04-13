import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client';

const BoardWrite = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  // 사용자가 입력할 제목과 내용을 담을 바구니
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 저장 중인지 확인하는 버튼 상태

  // ⭐ 권한 체크 (혹시나 주소창 치고 몰래 들어오는 사람 방지!)
  const isQnA = category === 'qna';
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canWrite = isQnA || hasManagerRole;

  // 권한이 없으면 쫓아냅니다.
  if (!session || !canWrite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">접근 권한이 없습니다.</h2>
          <p className="text-gray-500 mb-4">글쓰기 권한이 있는 계정으로 로그인해 주세요.</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#317F81] text-white rounded-md">돌아가기</button>
        </div>
      </div>
    );
  }

  // ⭐ '등록하기' 버튼을 누르면 실행되는 마법의 함수!
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    
    // 빈칸 검사
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🚀 방금 만든 내비게이션(API)으로 택배 쏘기!
      const response = await fetch('/api/board-write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          title: title,
          content: content,
          author_name: session.user.name,
          author_email: session.user.email,
          has_file: 0, // 지금은 파일 첨부 전이라 무조건 0으로 둡니다!
        }),
      });

      // 내비게이션이 "저장 성공!" 이라고 답변을 주면?
      if (response.ok) {
        alert("성공적으로 등록되었습니다!");
        navigate(`/board/${category}`); // 게시판 목록으로 이동
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${errorData.error}`);
      }
    } catch (error) {
      console.error("등록 중 에러 발생:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[800px] mx-auto px-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-4">
              {category.toUpperCase()} 글쓰기
            </h1>

            {/* 폼(Form) 시작 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* 1. 제목 입력창 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#317F81] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* 2. 내용 입력창 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 자유롭게 입력하세요."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-64 resize-y focus:outline-none focus:ring-2 focus:ring-[#317F81] focus:border-transparent transition-all"
                  required
                ></textarea>
              </div>

              {/* 3. 취소 & 등록 버튼 */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting} // 저장 중일 때는 버튼 비활성화 (따닥 방지!)
                  className={`px-8 py-3 font-bold text-white rounded-lg transition-colors ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#317F81] hover:bg-[#256062]"
                  }`}
                >
                  {isSubmitting ? "등록 중..." : "등록하기"}
                </button>
              </div>

            </form>
            {/* 폼(Form) 끝 */}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoardWrite;