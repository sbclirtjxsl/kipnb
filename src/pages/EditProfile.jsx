import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client';
import Header from '../components/Header'; 

const EditProfile = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // ✅ 실제 업로드할 파일 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 제출 중 상태 (중복 클릭 방지)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setPreviewImage(session.user.image || '/default-profile.png');
    }
  }, [session]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // ✅ 전송을 위해 파일 객체 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // ✅ 화면 미리보기용
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setIsSubmitting(true);

    try {
      // ✅ 1. 폼 데이터 생성 (파일과 이름 전송)
      const formData = new FormData();
      formData.append('name', name);
      if (selectedFile) {
        formData.append('profileImage', selectedFile); 
      }

      // ✅ 2. 백엔드 API로 정보 수정 요청 (경로는 실제 서버 환경에 맞게 수정 필요)
      const response = await fetch('/api/user/update', {
        method: 'POST',
        // FormData를 보낼 때는 Content-Type을 수동으로 설정하지 않습니다. (브라우저가 boundary와 함께 자동 설정)
        body: formData, 
      });

      if (response.ok) {
        // 성공 처리
        alert('정보가 성공적으로 수정되었습니다.');
        
        // ✅ 3. 선택 사항: 세션 정보 강제 갱신 
        // (만약 백엔드에서 세션을 자동 갱신해주지 않는다면, 페이지를 새로고침하거나 세션 업데이트 함수를 호출해야 변경된 이미지가 보입니다)
        window.location.href = '/mypage'; // 강제 새로고침을 동반한 이동 (확실한 업데이트 확인을 위함)
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
              className="flex-1 py-3.5 bg-bg-base border border-bd-default text-txt-secondary font-bold rounded-xl disabled:opacity-50"
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-brand-main text-white font-bold rounded-xl shadow-md shadow-brand-main/20 disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;