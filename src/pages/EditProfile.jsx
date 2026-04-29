import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client';
// ✅ 헤더 경로 수정 (src/components/Header.jsx)
import Header from '../components/Header'; 

const EditProfile = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setPreviewImage(session.user.image || '/default-profile.png');
    }
  }, [session]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('정보가 성공적으로 수정되었습니다.');
    navigate('/mypage');
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
    // ✅ 1. 최상단 컨테이너에 bg-bg-base를 주어 전체 배경색 통일 (다크모드 대응)
    <div className="min-h-screen bg-bg-base transition-colors duration-300">
      {/* ✅ 2. 헤더 적용 */}
      <Header />
      
      <main className="max-w-[600px] mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">정보 수정</h1>
          <p className="text-txt-muted mt-2">프로필 이미지와 닉네임을 변경할 수 있습니다.</p>
        </div>

        {/* ✅ 3. 카드 배경색을 bg-bg-surface로 설정하여 다크모드에서 자연스럽게 보이게 함 */}
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
              className="flex-1 py-3.5 bg-bg-base border border-bd-default text-txt-secondary font-bold rounded-xl"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-1 py-3.5 bg-brand-main text-white font-bold rounded-xl shadow-md shadow-brand-main/20"
            >
              저장하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;