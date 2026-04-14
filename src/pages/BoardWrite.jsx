import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client';

const boardNames = {
  edu: "교육/세미나",
  publish: "논문/출판",
  pr: "홍보",
  manufacture: "제조업체 정보",
  construction: "시공업체 정보",
  consulting: "컨설팅업체 정보",
  forms: "인증 관련 서식",
  notice: "공지사항",
  qna: "문의상담",
  archive: "자료실",
};

const BoardWrite = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // ⭐ 사진 파일과 미리보기 주소를 담을 바구니
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const isQnA = category === 'qna';
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canWrite = isQnA || hasManagerRole;

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

  // ⭐ 파일을 선택하면 자동으로 WebP로 변환해 주는 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일(JPG, PNG 등)만 업로드 가능합니다.");
      return;
    }

    // Canvas를 이용한 WebP 자동 변환!
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const webpFile = new File([blob], file.name.split('.')[0] + ".webp", {
            type: "image/webp",
          });
          
          setSelectedFile(webpFile); 
          setPreviewUrl(URL.createObjectURL(webpFile)); 
        }, "image/webp", 0.8);
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl = ""; 

      // ⭐ 사진이 첨부되었다면 R2로 먼저 전송!
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          fileUrl = uploadData.url; 
        } else {
          alert("사진 업로드에 실패했습니다.");
          setIsSubmitting(false);
          return; 
        }
      }

      // ⭐ 글 내용과 사진 주소를 한 번에 DB로 전송!
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
          image_url: fileUrl, 
          has_file: fileUrl ? 1 : 0, 
        }),
      });

      if (response.ok) {
        alert("성공적으로 등록되었습니다!");
        navigate(`/board/${category}`); 
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
              {boardNames[category] || '게시판'} 글쓰기
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
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

              {/* ⭐ 사진 첨부 영역이 드디어 화면에 나타납니다! */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">대표 사진 첨부 (자동 WebP 변환)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#eef6f6] file:text-[#317F81] hover:file:bg-[#deeaea] transition-colors cursor-pointer"
                />
                
                {/* 사진을 올리면 나타나는 미리보기 */}
                {previewUrl && (
                  <div className="mt-4 border rounded-xl p-2 bg-gray-50 inline-block">
                    <p className="text-xs text-gray-500 mb-2 font-bold">📷 미리보기</p>
                    <img src={previewUrl} alt="미리보기" className="max-h-[200px] rounded-lg shadow-sm" />
                  </div>
                )}
              </div>

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
                  disabled={isSubmitting}
                  className={`px-8 py-3 font-bold text-white rounded-lg transition-colors ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#317F81] hover:bg-[#256062]"
                  }`}
                >
                  {isSubmitting ? "등록 중..." : "등록하기"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoardWrite;