import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authClient } from '../auth-client';

const boardNames = {
  edu: "교육/세미나", publish: "논문/출판", pr: "홍보",
  manufacture: "제조업체 정보", construction: "시공업체 정보", consulting: "컨설팅업체 정보",
  forms: "인증 관련 서식", notice: "공지사항", qna: "문의상담", archive: "자료실",
};

const BoardWrite = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // ⭐ 여러 장의 사진과 미리보기를 담을 '배열(Array)' 바구니로 변경!
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const isQnA = category === 'qna';
  const hasManagerRole = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const canWrite = isQnA || hasManagerRole;

  if (!session || !canWrite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">접근 권한이 없습니다.</h2>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#317F81] text-white rounded-md mt-4">돌아가기</button>
        </div>
      </div>
    );
  }

  // ⭐ 여러 파일을 동시에 WebP로 변환해 주는 마법 함수!
  const handleFileChange = async (e) => {
    // 사용자가 선택한 여러 파일을 배열로 변환
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;

    // 이미지 파일만 걸러내기
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      alert("이미지 파일만 업로드 가능합니다.");
    }

    // 각 사진을 WebP로 변환하는 작업 (동시 진행)
    const webpPromises = validFiles.map(file => {
      return new Promise((resolve) => {
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
              resolve({ file: webpFile, preview: URL.createObjectURL(webpFile) });
            }, "image/webp", 0.8);
          };
        };
      });
    });

    // 모든 사진 변환이 끝날 때까지 기다렸다가 바구니에 담기
    const results = await Promise.all(webpPromises);
    setSelectedFiles(results.map(r => r.file));
    setPreviewUrls(results.map(r => r.preview));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해 주세요.");
    setIsSubmitting(true);

    try {
      let uploadedUrls = []; // R2에 올라간 여러 주소를 담을 바구니

      // ⭐ 사진이 여러 장이라면 하나씩 차례대로 R2 창고로 전송!
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
          if (uploadRes.ok) {
            const data = await uploadRes.json();
            return data.url;
          }
          return null;
        });

        // 모든 업로드가 끝날 때까지 대기
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.filter(url => url !== null); // 실패한 건 빼고 주소만 모으기
      }

      // ⭐ 여러 주소를 하나의 문자열(JSON)로 묶어서 DB로 전송!
      // 예: '["주소1.webp", "주소2.webp"]' 형태로 저장됩니다.
      const finalImageUrlString = uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : "";

      const response = await fetch('/api/board-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category, title, content,
          author_name: session.user.name,
          author_email: session.user.email,
          image_url: finalImageUrlString, 
          has_file: uploadedUrls.length > 0 ? 1 : 0, 
        }),
      });

      if (response.ok) {
        alert("성공적으로 등록되었습니다!");
        navigate(`/board/${category}`); 
      } else {
        alert("등록 실패");
      }
    } catch (error) {
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
            <h1 className="text-2xl font-extrabold mb-6 border-b pb-4">
              {boardNames[category] || '게시판'} 글쓰기
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#317F81] outline-none" />
              </div>

              <div>
                {/* ⭐ multiple 속성을 추가해서 여러 장을 드래그해서 선택할 수 있게 했습니다! */}
                <label className="block text-sm font-bold text-gray-700 mb-2">사진 첨부 (여러 장 선택 가능)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple 
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#eef6f6] file:text-[#317F81] hover:file:bg-[#deeaea] cursor-pointer"
                />
                
                {/* 여러 장의 사진 미리보기를 바둑판 배열로 보여줍니다. */}
                {previewUrls.length > 0 && (
                  <div className="mt-4 p-4 border rounded-xl bg-gray-50 flex gap-4 flex-wrap">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`미리보기 ${idx+1}`} className="h-[120px] rounded-lg shadow-sm object-cover border" />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required className="w-full px-4 py-3 border rounded-lg h-64 focus:ring-2 focus:ring-[#317F81] outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                <button type="submit" disabled={isSubmitting} className={`px-8 py-3 font-bold text-white rounded-lg ${isSubmitting ? "bg-gray-400" : "bg-[#317F81]"}`}>
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