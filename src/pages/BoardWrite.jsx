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
  const isAdmin = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  
  const [customDate, setCustomDate] = useState('');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]); 

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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;

    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (validFiles.length !== files.length) alert("이미지 파일만 업로드 가능합니다.");

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
              const webpFile = new File([blob], file.name.split('.')[0] + ".webp", { type: "image/webp" });
              resolve({ file: webpFile, preview: URL.createObjectURL(webpFile) });
            }, "image/webp", 0.8);
          };
        };
      });
    });

    const results = await Promise.all(webpPromises);
    setSelectedImages(prev => [...prev, ...results.map(r => r.file)]);
    setPreviewUrls(prev => [...prev, ...results.map(r => r.preview)]);
    e.target.value = ''; 
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedExts = ['zip', 'pdf', 'hwp', 'ppt', 'pptx', 'xls', 'xlsx'];
    const validFiles = [];

    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(ext)) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.`);
      } else {
        validFiles.push(file);
      }
    }
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
    e.target.value = ''; 
  };

  const handleRemoveFile = (indexToRemove) => {
    setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해 주세요.");
    setIsSubmitting(true);

    try {
      let uploadedImageUrls = [];
      let uploadedFileUrls = []; 

      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) return (await res.json()).url;
          return null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedImageUrls = results.filter(url => url !== null); 
      }

      if (attachedFiles.length > 0) {
        const filePromises = attachedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) return (await res.json()).url;
          return null;
        });
        const results = await Promise.all(filePromises);
        uploadedFileUrls = results.filter(url => url !== null);
      }

      const finalImageUrlString = uploadedImageUrls.length > 0 ? JSON.stringify(uploadedImageUrls) : "";
      const finalFileUrlString = uploadedFileUrls.length > 0 ? JSON.stringify(uploadedFileUrls) : "";

      const response = await fetch('/api/board-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category, title, content,
          author_name: session.user.name,
          author_email: session.user.email,
          image_url: finalImageUrlString, 
          file_url: finalFileUrlString, 
          has_file: uploadedFileUrls.length > 0 ? 1 : 0, 
          custom_date: customDate ? new Date(customDate).toISOString() : null,
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

              {/* ⭐ 시간 뺀 달력 & 클릭 시 펼쳐짐 적용 */}
              {isAdmin && (
                <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200 shadow-sm">
                  <label className="block text-sm font-bold text-yellow-900 mb-2">
                    👑 [관리자 전용] 과거/미래 작성 일자 지정 (선택)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      className="px-4 py-2 border border-yellow-300 rounded-lg text-sm bg-white text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all cursor-pointer"
                    />
                    <span className="text-xs text-yellow-700">
                      ※ 달력을 비워두시면 <strong className="text-red-500 underline">오늘 날짜</strong>로 자동 등록됩니다.
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">📷 본문 사진 첨부 (여러 장 가능, 자동 변환)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-[#317F81] file:shadow-sm cursor-pointer" />
                
                {previewUrls.length > 0 && (
                  <div className="mt-4 flex gap-4 flex-wrap">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative inline-block">
                        <img src={url} alt={`미리보기`} className="h-[80px] rounded shadow-sm border" />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">📁 다운로드용 자료 첨부 (여러 개 선택 가능)</label>
                <p className="text-xs text-gray-500 mb-3">지원 형식: zip, pdf, hwp, ppt, xlsx 등</p>
                <input type="file" accept=".zip,.pdf,.hwp,.ppt,.pptx,.xls,.xlsx" multiple onChange={handleDocumentChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-blue-600 file:shadow-sm cursor-pointer" />
                
                {attachedFiles.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {attachedFiles.map((file, idx) => (
                      <li key={idx} className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2 font-medium">
                          <span className="text-blue-500">📎</span> {file.name}
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1 bg-red-50 rounded-md transition-colors"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
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