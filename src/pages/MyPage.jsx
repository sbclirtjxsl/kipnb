import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client'; 
// ✅ 헤더 컴포넌트 경로 확인 (사용자 환경에 맞춤)
import Header from '../components/Header'; 

const MyPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  // ✅ 실제 탈퇴 및 연동 해제 로직
  const handleWithdrawal = async () => {
    if (!window.confirm('정말 네이버 연동을 해제하고 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    try {
      // 1. 백엔드 탈퇴 API 호출
      const response = await fetch('/api/auth/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 2. 성공 시 프론트엔드 세션 로그아웃
        await authClient.signOut();
        alert('연동 해제 및 탈퇴가 완료되었습니다.');
        
        // 3. 메인 페이지로 이동 (상태 초기화를 위해 강제 이동)
        window.location.href = '/'; 
      } else {
        const errorData = await response.json();
        alert(`탈퇴 처리 중 오류가 발생했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('서버와 통신하는 중 오류가 발생했습니다.');
    }
  };

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex justify-center items-center min-h-[60vh] text-txt-muted">
          <div className="animate-pulse font-main">회원 정보를 불러오는 중입니다...</div>
        </div>
      );
    }

    if (!session?.user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 font-main">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-txt-primary mb-2">로그인이 필요합니다</h2>
            <p className="text-txt-secondary">마이페이지는 로그인 후 이용하실 수 있습니다.</p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-brand-main text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg"
          >
            로그인 페이지로 이동
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-[800px] mx-auto px-4 py-12 font-main">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">마이페이지</h1>
          <p className="text-txt-muted mt-2">내 정보 관리 및 서비스 설정</p>
        </div>

        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <img 
                // ✅ 핵심: session.user.image가 로그인 시 저장된 소셜 프로필 이미지 URL입니다.
                // 만약 이미지가 없다면 기본 아이콘이나 대체 이미지를 보여주도록 설정합니다.
                src={session?.user?.image || 'https://via.placeholder.com/150?text=No+Image'} 
                alt="프로필" 
                className="w-32 h-32 rounded-3xl object-cover border-4 border-bg-base shadow-xl"
                // ✅ 네이버 등 외부 이미지 로드 실패 시를 대비한 보안 로직
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Profile'; 
                }}
              />
              {/* 이미지 위 오버레이 (디자인 요소) */}
              <div className="absolute inset-0 bg-black/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="flex-grow text-center md:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <h2 className="text-2xl font-black text-txt-primary">{session.user.name} 님</h2>
                <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-[11px] font-bold rounded-full border border-brand-main/20">
                  {session.user.role || '일반회원'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3 text-txt-secondary">
                  <span className="text-xs font-bold text-txt-muted w-16 uppercase">이메일</span>
                  <span className="text-sm font-medium">{session.user.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-txt-secondary">
                  <span className="text-xs font-bold text-txt-muted w-16 uppercase">연동계정</span>
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#03C75A] rounded-full"></span>
                    네이버 (Naver Login)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-bd-default flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/edit-profile')}
                className="px-6 py-2.5 bg-bg-base border border-bd-default text-txt-primary text-sm font-bold rounded-xl hover:bg-bg-surface-hover transition-colors"
              >
                정보 수정
              </button>
              <button 
                onClick={async () => {
                  await authClient.signOut();
                  navigate('/');
                }}
                className="px-6 py-2.5 bg-bg-base border border-bd-default text-txt-secondary text-sm font-bold rounded-xl hover:bg-bg-surface-hover transition-colors"
              >
                로그아웃
              </button>
            </div>

            {/* ✅ 수정된 버튼: handleWithdrawal 함수 호출 */}
            <button 
              onClick={handleWithdrawal}
              className="text-xs font-bold text-txt-muted hover:text-red-500 underline underline-offset-4 transition-colors"
            >
              서비스 연동 해제 및 회원탈퇴
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-txt-muted">
          개인정보 보호를 위해 수집된 정보는 서비스 운영 목적 외에 사용되지 않으며, <br className="hidden md:block" />
          언제든지 연동 해제를 통해 정보를 파기할 수 있습니다.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-base transition-colors duration-300">
      <Header />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default MyPage;