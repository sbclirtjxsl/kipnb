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

const BoardEdit = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  
  // 관리자 권한 확인
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === '관리자' || session?.user?.role === '운영진';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [customDate, setCustomDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [loading, setLoading] = useState(true);

  // 이미지 및 파일 관련 상태
  const [existingImages, setExistingImages] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  // 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/board-detail?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
          
          if (data.created_at) {
            const date = new Date(data.created_at);
            const offset = date.getTimezoneOffset() * 60000;
            const kstDate = new Date(date.getTime() - offset);
            setCustomDate(kstDate.toISOString().slice(0, 16));
          }
          
          if (data.image_url) {
            try { setExistingImages(data.image_url.startsWith('[') ? JSON.parse(data.image_url) : [data.image_url]); } 
            catch(e) { setExistingImages([data.image_url]); }
          }
          if (data.file_url) {
            try { setExistingFiles(data.file_url.startsWith('[') ? JSON.parse(data.file_url) : [data.file_url]); } 
            catch(e) { setExistingFiles([data.file_url]); }
          }
        } else {
          alert("게시글을 불러올 수 없습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  // ⭐ 첨부파일 관련 핸들러 함수들 (복구 완료!)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setNewPreviewUrls(prev => [...prev, ...urls]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  };

  const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  const removeExistingFile = (index) => setExistingFiles(prev => prev.filter((_, i) => i !== index));
  const removeNewFile = (index) => setNewFiles(prev => prev.filter((_, i) => i !== index));

  // 전송 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해 주세요.");
    setIsSubmitting(true);

    try {
      let uploadedNewImageUrls = [];
      let uploadedNewFileUrls = []; 

      // ⭐ 새 이미지 서버 업로드 (기존 글쓰기 페이지 로직과 동일하게 작동하도록 구성)
      if (newImages.length > 0) {
        const imgFormData = new FormData();
        newImages.forEach(file => imgFormData.append('images', file));
        // 주의: 대표님의 실제 업로드 API 주소가 다르면 여기를 수정해야 할 수 있습니다!
        const imgRes = await fetch('/api/upload', { method: 'POST', body: imgFormData });
        if(imgRes.ok) {
           const data = await imgRes.json();
           uploadedNewImageUrls = data.imageUrls || data.urls || [];
        }
      }

      // ⭐ 새 일반 파일 서버 업로드
      if (newFiles.length > 0) {
        const fileFormData = new FormData();
        newFiles.forEach(file => fileFormData.append('files', file));
        const fileRes = await fetch('/api/upload', { method: 'POST', body: fileFormData });
        if(fileRes.ok) {
           const data = await fileRes.json();
           uploadedNewFileUrls = data.fileUrls || data.urls || [];
        }
      }

      const finalImages = [...existingImages, ...uploadedNewImageUrls];
      const finalFiles = [...existingFiles, ...uploadedNewFileUrls];

      const response = await fetch('/api/board-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, 
          category, 
          title, 
          content,
          image_url: finalImages.length > 0 ? JSON.stringify(finalImages) : "", 
          file_url: finalFiles.length > 0 ? JSON.stringify(finalFiles) : "", 
          has_file: finalFiles.length > 0 ? 1 : 0, 
          custom_date: customDate ? new Date(customDate).toISOString() : null,
        }),
      });

      if (response.ok) {
        alert("성공적으로 수정되었습니다!");
        navigate(`/board/${category}/${id}`); 
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex flex-col font-sans">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-extrabold mb-6 border-b pb-4">
              {boardNames[category]} 글 수정
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* 1. 제목 입력 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#317F81] outline-none" />
              </div>

              {/* 2. 관리자 전용 날짜 수정 */}
              {isAdmin && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <label className="block text-sm font-bold text-yellow-900 mb-2">
                    👑 [관리자 전용] 작성 일자 수정 (달력 선택)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="px-4 py-2 border border-yellow-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-yellow-200"
                    />
                    <p className="text-xs text-yellow-700">변경 시 게시판 목록에서 해당 날짜 순서로 재배치됩니다.</p>
                  </div>
                </div>
              )}

              {/* ⭐ 3. 내용 입력 (복구 완료!) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required 
                  rows={12}
                  placeholder="내용을 입력해 주세요..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#317F81] outline-none resize-y" 
                />
              </div>

              {/* ⭐ 4. 사진 첨부 (복구 완료!) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">사진 첨부 (다중 선택 가능)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                
                {/* 사진 미리보기 영역 */}
                {(existingImages.length > 0 || newPreviewUrls.length > 0) && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {existingImages.map((url, idx) => (
                      <div key={`exist-img-${idx}`} className="relative border rounded-lg overflow-hidden w-24 h-24">
                        <img src={url} alt="기존 이미지" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600">✕</button>
                      </div>
                    ))}
                    {newPreviewUrls.map((url, idx) => (
                      <div key={`new-img-${idx}`} className="relative border rounded-lg overflow-hidden w-24 h-24">
                        <img src={url} alt="새 이미지" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ⭐ 5. 일반 파일 첨부 (복구 완료!) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">일반 파일 첨부 (다중 선택 가능)</label>
                <input type="file" multiple onChange={handleFileChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                
                {/* 첨부된 파일 목록 영역 */}
                {(existingFiles.length > 0 || newFiles.length > 0) && (
                  <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
                    {existingFiles.map((url, idx) => {
                       const fileName = decodeURIComponent(url.split('/').pop() || `기존파일_${idx+1}`);
                       return (
                         <div key={`exist-file-${idx}`} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg border">
                           <span className="truncate max-w-[80%]">💾 {fileName}</span>
                           <button type="button" onClick={() => removeExistingFile(idx)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
                         </div>
                       );
                    })}
                    {newFiles.map((file, idx) => (
                      <div key={`new-file-${idx}`} className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <span className="truncate max-w-[80%] text-green-700">새 파일: {file.name}</span>
                        <button type="button" onClick={() => removeNewFile(idx)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. 취소 및 수정 버튼 */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                <button type="submit" disabled={isSubmitting} className={`px-8 py-3 font-bold text-white rounded-lg transition-colors ${isSubmitting ? "bg-gray-400" : "bg-[#317F81] hover:bg-[#256062]"}`}>
                  {isSubmitting ? "수정 중..." : "수정 완료"}
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

export default BoardEdit;