import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ⭐ 1. 로그인 정보 가져오기 위해 꼭 추가!
import { authClient } from '../auth-client'; 

const BoardDetail = () => {
  const { category, id } = useParams(); 
  const navigate = useNavigate();
  
  // ⭐ 2. 현재 로그인한 내 정보 꺼내오기
  const { data: session } = authClient.useSession();

  // (가짜 데이터)
  const post = {
    id: id,
    title: `테스트 게시물 제목입니다. [${id}번 글]`,
    author: "관리자", 
    date: "2026.04.13 15:30",
    views: 42,
    hasAttachment: true,
    content: `
      여기에 게시글 본문 내용이 들어갑니다.
      줄바꿈도 잘 적용되는지 확인해 봅니다.
      
      나중에는 웹 에디터(Quill 등)를 붙여서 사진도 넣고 글씨 색깔도 바꿀 수 있게 만들 예정입니다.
      지금은 일단 텍스트가 잘 나오는지 뼈대만 잡아둡니다!
    `,
    files: [
      { name: "2026_상반기_안내문.pdf", size: "2.4MB" },
      { name: "관련_이미지_모음.zip", size: "15MB" }
    ]
  };

  // ⭐ 3. 권한 계산기 (수정/삭제 버튼을 보여줄지 말지 결정)
  // 조건 1: 내 이름과 글 작성자 이름이 같은가? (실전에서는 이름 대신 이메일이나 고유ID로 비교합니다!)
  const isAuthor = session?.user?.name === post.author;
  // 조건 2: 내 직급이 관리자나 운영진인가?
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  
  // 최종 결론: 내가 썼거나, 내가 관리자/운영진이면 버튼 보여줌! (true)
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
                  {category.toUpperCase()}
                </span>
                <span className="text-gray-400 text-sm">No. {post.id}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {post.title}
              </h1>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">{post.author}</span>
                  <span>{post.date}</span>
                </div>
                <div>조회수 {post.views}</div>
              </div>
            </div>

            {post.hasAttachment && (
              <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex flex-col gap-2">
                <span className="text-sm font-bold text-gray-700">첨부파일</span>
                {post.files.map((file, idx) => (
                  <button key={idx} className="flex items-center text-sm text-gray-600 hover:text-[#317F81] transition-colors text-left">
                    💾 <span className="ml-2 underline underline-offset-2">{file.name}</span>
                    <span className="ml-2 text-gray-400 text-xs">({file.size})</span>
                  </button>
                ))}
              </div>
            )}

            <div className="px-8 py-10 min-h-[300px] text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            {/* 왼쪽: 목록으로 버튼 (누구나 항상 보임) */}
            <button 
              onClick={() => navigate(`/board/${category}`)}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              목록으로
            </button>

            {/* ⭐ 오른쪽: 투명망토를 쓴 수정/삭제 버튼 */}
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