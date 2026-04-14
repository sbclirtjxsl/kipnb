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
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [loading, setLoading] = useState(true);

  // 기존에 올려둔 파일 주소들을 담을 바구니
  const [existingImages, setExistingImages] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  // 새로 추가할 파일들을 담을 바구니
  const [newImages, setNewImages] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  // 1. 화면이 켜지면 기존 글 데이터를 불러옵니다.
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/board-detail?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
          
          // 기존 사진 주소 파싱
          if (data.image_url) {
            try { setExistingImages(data.image_url.startsWith('[') ? JSON.parse(data.image_url) : [data.image_url]); } 
            catch(e) { setExistingImages([data.image_url]); }
          }
          // 기존 자료 주소 파싱
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

  // 기존 사진 삭제 버튼
  const handleRemoveExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };
  // 기존 자료 삭제 버튼
  const handleRemoveExistingFile = (idx) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // 새로 추가하는 사진 (WebP 변환)
  const handleNewImageChange = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.type.startsWith("image/"));

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
    setNewImages(prev => [...prev, ...results.map(r => r.file)]);
    setNewPreviewUrls(prev => [...prev, ...results.map(r => r.preview)]);
    e.target.value = ''; 
  };
  const handleRemoveNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };

  // 새로 추가하는 자료
  const handleNewDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewFiles(prev => [...prev, ...files]);
    e.target.value = ''; 
  };
  const handleRemoveNewFile = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해 주세요.");
    setIsSubmitting(true);

    try {
      let uploadedNewImageUrls = [];
      let uploadedNewFileUrls = []; 

      // 1. 새 사진들 R2 업로드
      if (newImages.length > 0) {
        const uploadPromises = newImages.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) return (await res.json()).url;
          return null;
        });
        uploadedNewImageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null); 
      }

      // 2. 새 자료들 R2 업로드
      if (newFiles.length > 0) {
        const filePromises = newFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) return (await res.json()).url;
          return null;
        });
        uploadedNewFileUrls = (await Promise.all(filePromises)).filter(url => url !== null);
      }

      // 최종 주소 합치기 (남겨둔 기존 주소 + 방금 올린 새 주소)
      const finalImages = [...existingImages, ...uploadedNewImageUrls];
      const finalFiles = [...existingFiles, ...uploadedNewFileUrls];

      const response = await fetch('/api/board-update', {
        method: 'POST', // 수정은 board-update로 보냅니다!
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, category, title, content,
          image_url: finalImages.length > 0 ? JSON.stringify(finalImages) : "", 
          file_url: finalFiles.length > 0 ? JSON.stringify(finalFiles) : "", 
          has_file: finalFiles.length > 0 ? 1 : 0, 
        }),
      });

      if (response.ok) {
        alert("성공적으로 수정되었습니다!");
        navigate(`/board/${category}/detail/${id}`); 
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-extrabold mb-6 border-b pb-4">
              {boardNames[category]} 글 수정
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#317F81] outline-none" />
              </div>

              {/* 📷 1. 사진 첨부 구역 */}
              <div className="p-4 bg-gray-50 rounded-xl border">
                <label className="block text-sm font-bold text-gray-700 mb-2">📷 사진 수정</label>
                
                {/* 기존에 올렸던 사진들 */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">기존 사진</p>
                    <div className="flex gap-3 flex-wrap">
                      {existingImages.map((url, idx) => (
                        <div key={idx} className="relative inline-block opacity-70 hover:opacity-100 transition-opacity">
                          <img src={url} alt="기존" className="h-[60px] rounded shadow-sm border" />
                          <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-[#317F81] file:shadow-sm cursor-pointer" />
                
                {/* 방금 새로 추가한 사진 미리보기 */}
                {newPreviewUrls.length > 0 && (
                  <div className="mt-4 flex gap-4 flex-wrap">
                    {newPreviewUrls.map((url, idx) => (
                      <div key={idx} className="relative inline-block border-2 border-[#317F81] rounded">
                        <img src={url} alt="새사진" className="h-[80px] rounded" />
                        <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold shadow">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 📁 2. 자료 첨부 구역 */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">📁 다운로드 자료 수정</label>
                
                {/* 기존 자료들 */}
                {existingFiles.length > 0 && (
                  <ul className="mb-4 flex flex-col gap-1">
                    {existingFiles.map((url, idx) => {
                      const name = decodeURIComponent(url.split('/').pop().split('-').slice(1).join('-')) || `기존파일_${idx}`;
                      return (
                        <li key={idx} className="text-sm text-gray-600 bg-white p-2 rounded border flex justify-between items-center opacity-80">
                          <span>📎 {name}</span>
                          <button type="button" onClick={() => handleRemoveExistingFile(idx)} className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded">삭제</button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <input type="file" accept=".zip,.pdf,.hwp,.ppt,.pptx,.xls,.xlsx" multiple onChange={handleNewDocumentChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-blue-600 cursor-pointer" />
                
                {newFiles.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {newFiles.map((file, idx) => (
                      <li key={idx} className="text-sm text-blue-700 font-bold bg-white p-2 rounded border border-blue-200 flex justify-between items-center">
                        <span>✨ {file.name}</span>
                        <button type="button" onClick={() => handleRemoveNewFile(idx)} className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded">취소</button>
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