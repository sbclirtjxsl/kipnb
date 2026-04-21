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

const BoardForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  // ⭐ 모드 판별: URL에 글 번호(id)가 있으면 '수정 모드', 없으면 '글쓰기 모드'
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const urlId = pathParts[pathParts.length - 1];
  const isWriteRoute = urlId === 'write';
  const id = params.id || params.postId || params.boardId || (!isWriteRoute ? urlId : null);
  const isEdit = !!id; 
  const category = params.category || pathParts[pathParts.length - (isEdit ? 3 : 2)];

  // 권한 확인
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === '관리자' || session?.user?.role === '운영진';
  const isQnA = category === 'qna';
  const canWrite = isQnA || isAdmin;

  // 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [loading, setLoading] = useState(isEdit); // 수정 모드일 때만 초기 로딩 활성화

  // 파일 및 이미지 상태 관리
  const [existingImages, setExistingImages] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  // [수정 모드] 기존 데이터 불러오기
  useEffect(() => {
    if (!isEdit) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/board-detail?id=${id}&t=${Date.now()}`);
        if (res.ok) {
          const rawData = await res.json();
          const data = Array.isArray(rawData) ? rawData[0] : (rawData.post || rawData);
          
          if (!data || !data.title) {
            alert("기존 글 데이터를 불러오지 못했습니다.");
            navigate(-1);
            return;
          }

          setTitle(data.title || '');
          setContent(data.content || '');
          
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
        console.error("데이터 패치 에러:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, isEdit, navigate]);

  // 권한 없는 사용자가 글쓰기 접근 시 차단
  if (!isEdit && (!session || !canWrite)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">접근 권한이 없습니다.</h2>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#317F81] text-white rounded-md mt-4 hover:bg-[#256062] transition-colors">돌아가기</button>
        </div>
      </div>
    );
  }

  // ⭐ 이미지 첨부 핸들러 (WebP 자동 변환 로직 포함)
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
    setNewImages(prev => [...prev, ...results.map(r => r.file)]);
    setNewPreviewUrls(prev => [...prev, ...results.map(r => r.preview)]);
    e.target.value = ''; 
  };

  // ⭐ 파일 첨부 핸들러 (확장자 검사 로직 포함)
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
    
    setNewFiles(prev => [...prev, ...validFiles]);
    e.target.value = ''; 
  };

  // 삭제 핸들러 모음
  const removeExistingImage = (idx) => setExistingImages(prev => prev.filter((_, i) => i !== idx));
  const removeNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };
  const removeExistingFile = (idx) => setExistingFiles(prev => prev.filter((_, i) => i !== idx));
  const removeNewFile = (idx) => setNewFiles(prev => prev.filter((_, i) => i !== idx));

  // 폼 전송 (글쓰기 & 수정 통합)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해 주세요.");
    setIsSubmitting(true);

    try {
      let uploadedNewImageUrls = [];
      let uploadedNewFileUrls = []; 

      // 새 이미지 서버 업로드
      if (newImages.length > 0) {
        const uploadPromises = newImages.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file); // 이전 Write 로직 맞춤
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) return (await res.json()).url || (await res.json()).imageUrls?.[0];
          return null;
        });
        uploadedNewImageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
      }

      // 새 파일 서버 업로드
      if (newFiles.length > 0) {
        const filePromises = newFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) return (await res.json()).url || (await res.json()).fileUrls?.[0];
          return null;
        });
        uploadedNewFileUrls = (await Promise.all(filePromises)).filter(url => url !== null);
      }

      // 기존 데이터와 방금 업로드한 새 데이터 합치기
      const finalImages = [...existingImages, ...uploadedNewImageUrls];
      const finalFiles = [...existingFiles, ...uploadedNewFileUrls];

      // ⭐ 수정인지 새 글인지에 따라 API 주소 분기
      const apiUrl = isEdit ? '/api/board-update' : '/api/board-write';
      
      const payload = {
        category, 
        title, 
        content,
        author_name: session?.user?.name || '',
        author_email: session?.user?.email || '',
        image_url: finalImages.length > 0 ? JSON.stringify(finalImages) : "", 
        file_url: finalFiles.length > 0 ? JSON.stringify(finalFiles) : "", 
        has_file: finalFiles.length > 0 ? 1 : 0, 
        custom_date: customDate ? new Date(customDate).toISOString() : null,
      };

      // 수정일 경우 id 추가
      if (isEdit) payload.id = id;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(isEdit ? "성공적으로 수정되었습니다!" : "성공적으로 등록되었습니다!");
        navigate(isEdit ? `/board/${category}/${id}` : `/board/${category}`); 
      } else {
        alert("작업 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#2a2a2a] dark:bg-gray-900 text-white transition-colors duration-300">데이터를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-[#2a2a2a] dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
            <h1 className="text-2xl font-extrabold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-900 dark:text-white transition-colors">
              {boardNames[category] || '게시판'} {isEdit ? '글 수정' : '글쓰기'}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* 제목 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">제목</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#317F81] dark:focus:ring-[#4fd1d5] outline-none transition-colors" 
                />
              </div>

              {/* 관리자 전용 날짜 지정 */}
              {isAdmin && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    👑 [관리자 전용] 과거/미래 작성 일자 지정 (선택)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#317F81]/50 cursor-pointer transition-colors"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {isEdit ? "변경 시 게시판 목록에서 해당 날짜 순서로 재배치됩니다." : "※ 달력을 비워두시면 오늘 날짜로 자동 등록됩니다."}
                    </span>
                  </div>
                </div>
              )}

              {/* 내용 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">내용</label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg h-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#317F81] dark:focus:ring-[#4fd1d5] outline-none transition-colors resize-y"
                ></textarea>
              </div>

              {/* 사진 첨부 (다크모드 완벽 대응) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📷 본문 사진 첨부 (여러 장 가능, 자동 WebP 변환)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageChange} 
                  className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 dark:file:border-gray-600 file:bg-gray-50 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 file:font-medium hover:file:bg-gray-100 dark:hover:file:bg-gray-600 cursor-pointer transition-colors" 
                />
                
                {(existingImages.length > 0 || newPreviewUrls.length > 0) && (
                  <div className="mt-4 flex gap-4 flex-wrap">
                    {/* 기존 이미지 */}
                    {existingImages.map((url, idx) => (
                      <div key={`ex-img-${idx}`} className="relative inline-block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                        <img src={url} alt="기존 이미지" className="w-24 h-24 object-cover" />
                        <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors">✕</button>
                      </div>
                    ))}
                    {/* 새로 추가된 이미지 */}
                    {newPreviewUrls.map((url, idx) => (
                      <div key={`new-img-${idx}`} className="relative inline-block border-2 border-green-400 dark:border-green-600 rounded-lg overflow-hidden shadow-sm">
                        <img src={url} alt="새 이미지" className="w-24 h-24 object-cover" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 자료 첨부 (다크모드 완벽 대응) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📁 다운로드용 자료 첨부 (여러 개 선택 가능)</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">지원 형식: zip, pdf, hwp, ppt, xlsx 등</p>
                <input 
                  type="file" 
                  accept=".zip,.pdf,.hwp,.ppt,.pptx,.xls,.xlsx" 
                  multiple 
                  onChange={handleDocumentChange} 
                  className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 dark:file:border-gray-600 file:bg-gray-50 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 file:font-medium hover:file:bg-gray-100 dark:hover:file:bg-gray-600 cursor-pointer transition-colors" 
                />
                
                {(existingFiles.length > 0 || newFiles.length > 0) && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {/* 기존 파일 */}
                    {existingFiles.map((url, idx) => {
                      const fileName = decodeURIComponent(url.split('/').pop() || `첨부파일_${idx+1}`);
                      return (
                        <li key={`ex-file-${idx}`} className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-2 font-medium truncate max-w-[80%]">
                            <span className="text-gray-500 dark:text-gray-400">📎</span> {fileName}
                          </div>
                          <button type="button" onClick={() => removeExistingFile(idx)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-bold px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-md transition-colors">삭제</button>
                        </li>
                      );
                    })}
                    {/* 새로 추가된 파일 */}
                    {newFiles.map((file, idx) => (
                      <li key={`new-file-${idx}`} className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2 font-medium truncate max-w-[80%]">
                          <span>✨</span> 새 파일: {file.name}
                        </div>
                        <button type="button" onClick={() => removeNewFile(idx)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-bold px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-md transition-colors">삭제</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 하단 버튼 구역 */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="px-6 py-3 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`px-8 py-3 font-bold text-white rounded-lg transition-colors ${isSubmitting ? "bg-gray-400 dark:bg-gray-600" : "bg-[#317F81] hover:bg-[#256062]"}`}
                >
                  {isSubmitting ? "처리 중..." : (isEdit ? "수정 완료" : "등록하기")}
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

export default BoardForm;