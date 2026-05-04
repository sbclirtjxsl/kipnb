import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client';
import Header from '../components/Header'; 

const EditProfile = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // 세션 정보 로드 시 초기값 세팅
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setPreviewImage(session.user.image || '/default-profile.png');
    }
  }, [session]);

  // ✅ 1. 이미지 선택 시 브라우저에서 리사이징 및 WebP 변환
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 원본 파일 10MB 이상 업로드 방지
    const MAX_ORIGINAL_SIZE = 10 * 1024 * 1024; 
    if (file.size > MAX_ORIGINAL_SIZE) {
      alert('10MB 이하의 이미지만 선택 가능합니다.');
      e.target.value = ''; 
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // 최대 해상도 800x800으로 비율에 맞춰 리사이징
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // 캔버스에 리사이징된 이미지 그리기
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // WebP 포맷으로 압축 (품질 80%)
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('이미지 변환에 실패했습니다.');
            return;
          }

          // 압축 후 파일 크기 2MB 초과 시 방어
          const MAX_WEBP_SIZE = 2 * 1024 * 1024; 
          if (blob.size > MAX_WEBP_SIZE) {
            alert('압축 후에도 용량이 너무 큽니다. 다른 이미지를 선택해주세요.');
            return;
          }

          // 전송을 위한 File 객체 생성
          const webpFile = new File([blob], 'profile.webp', {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          setSelectedFile(webpFile); // 서버 전송용 파일 세팅
          setPreviewImage(URL.createObjectURL(webpFile)); // 화면 미리보기용 URL 세팅
        }, 'image/webp', 0.8);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ✅ 2. 폼 제출 시 백엔드 API로 데이터 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      // ✅ 추가됨: 백엔드에서 식별할 수 있도록 유저 ID 함께 전송
      formData.append('userId', session.user.id); 

      if (selectedFile) {
        formData.append('profileImage', selectedFile); 
      }

      // Cloudflare Functions 백엔드 API 호출
      const response = await fetch('/api/user/update', {
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        alert('정보가 성공적으로 수정되었습니다.');
        // 마이페이지로 이동하면서 새로고침하여 변경된 세션 정보를 다시 불러오게 함
        window.location.href = '/mypage'; 
      } else {
        const errorData = await response.json();
        alert(`수정 실패: ${errorData.message || '알 수 없는 오류'}`);
      }

    } catch (error) {
      console.error('Profile update error:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-bg-base">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh] text-txt-muted">
          <div className="animate-pulse">정보를 불러오는 중입니다...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base transition-colors duration-300">
      <Header />
      
      <main className="max-w-[600px] mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">정보 수정</h1>
          <p className="text-txt-muted mt-2">프로필 이미지와 닉네임을 변경할 수 있습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              <img 
                src={previewImage} 
                alt="프로필" 
                className="w-32 h-32 rounded-3xl object-cover border-4 border-bg-base shadow-md"
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* 이미지 위 오버레이 (마우스 올렸을 때 어두워지는 효과) */}
              <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex justify-center items-center">
                <span className="text-white text-sm font-bold drop-shadow-md">변경</span>
              </div>
            </div>
            <p className="text-xs text-txt-muted mt-3">클릭하여 이미지 변경</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-txt-primary mb-2">이름</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-base border border-bd-default rounded-xl px-4 py-3 text-txt-primary focus:border-brand-main outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-txt-primary mb-2">이메일 (수정 불가)</label>
              <input 
                type="email" 
                value={session?.user?.email || ''}
                className="w-full bg-bg-base/50 border border-bd-subtle rounded-xl px-4 py-3 text-txt-muted cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button 
              type="button"
              onClick={() => navigate('/mypage')}
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-bg-base border border-bd-default text-txt-secondary font-bold rounded-xl disabled:opacity-50 transition-colors hover:bg-bg-surface-hover"
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-brand-main text-white font-bold rounded-xl shadow-md shadow-brand-main/20 disabled:opacity-50 hover:bg-brand-dark transition-colors flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  저장 중...
                </>
              ) : '저장하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;