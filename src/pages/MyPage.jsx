import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client'; 
import Header from '../components/Header'; 

const MyPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  // ✅ 실제 탈퇴 및 연동 해제 로직
  const handleWithdrawal = async () => {
    if (!window.confirm('정말 연동을 해제하고 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await authClient.signOut();
        alert('연동 해제 및 탈퇴가 완료되었습니다.');
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

  // 🛠️ 추가됨: 새로운 소셜 계정 추가 연동을 요청하는 함수
  const handleConnectProvider = (provider) => {
    alert(`${provider} 계정 추가 연동을 시작합니다. (백엔드 OAuth 핸들러로 이동 예정)`);
    // 🔗 백엔드 API 주소가 준비되면 아래 주석을 해제하여 리다이렉트 시킵니다.
    // window.location.href = `/api/auth/connect/${provider}`;
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

    // 💡 백엔드 연동 전까지 화면을 미리 확인하기 위한 가상 데이터입니다.
    // 나중에 백엔드 API에서 사용자의 전체 연동 목록을 가져와 매핑하게 됩니다.
    const mockConnectedProviders = {
      google: { connected: session.user.email?.includes('gmail.com'), email: session.user.email },
      naver: { connected: session.user.email?.includes('naver.com'), email: session.user.email },
      kakao: { connected: session.user.email?.includes('kakao.com'), email: session.user.email }
    };

    return (
      <div className="max-w-[800px] mx-auto px-4 py-12 font-main">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">마이페이지</h1>
          <p className="text-txt-muted mt-2">내 정보 관리 및 서비스 설정</p>
        </div>

        {/* 프로필 카드 영역 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm transition-all duration-300 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <img 
                src={session?.user?.image || 'https://via.placeholder.com/150?text=No+Image'} 
                alt="프로필" 
                className="w-32 h-32 rounded-3xl object-cover border-4 border-bg-base shadow-xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Profile'; 
                }}
              />
              <div className="absolute inset-0 bg-black/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="flex-grow text-center md:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <h2 className="text-2xl font-black text-txt-primary">{session.user.name} 님</h2>
                <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-[11px] font-bold rounded-full border border-brand-main/20">
                  {session.user.role || '회원'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3 text-txt-secondary">
                  <span className="text-xs font-bold text-txt-muted w-16 uppercase">이메일</span>
                  <span className="text-sm font-medium">{session.user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🛠️ 추가됨: 다중 소셜 계정 연동 관리 테이블 카드 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm transition-all duration-300 mb-8">
          <h3 className="text-xl font-bold text-txt-primary mb-2">소셜 계정 연동 관리</h3>
          <p className="text-sm text-txt-muted mb-6">
            다양한 소셜 계정을 연동하면 어떤 계정으로 로그인해도 동일한 내 정보를 이용할 수 있습니다.
          </p>

          <div className="flex flex-col gap-4">
            {/* 1. 구글 연동 행 */}
            <div className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                <span className="font-bold text-sm md:text-base text-txt-primary">구글 (Google)</span>
                {mockConnectedProviders.google.connected && (
                  <span className="text-xs text-txt-muted hidden sm:inline">({mockConnectedProviders.google.email})</span>
                )}
              </div>
              <button
                onClick={() => handleConnectProvider('google')}
                disabled={mockConnectedProviders.google.connected}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
                  mockConnectedProviders.google.connected
                    ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20'
                    : 'bg-brand-main text-white hover:bg-brand-dark shadow-sm'
                }`}
              >
                {mockConnectedProviders.google.connected ? '연동 완료' : '연동하기'}
              </button>
            </div>

            {/* 2. 네이버 연동 행 */}
            <div className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
                <span className="font-bold text-sm md:text-base text-txt-primary">네이버 (Naver)</span>
                {mockConnectedProviders.naver.connected && (
                  <span className="text-xs text-txt-muted hidden sm:inline">({mockConnectedProviders.naver.email})</span>
                )}
              </div>
              <button
                onClick={() => handleConnectProvider('naver')}
                disabled={mockConnectedProviders.naver.connected}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
                  mockConnectedProviders.naver.connected
                    ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20'
                    : 'bg-brand-main text-white hover:bg-brand-dark shadow-sm'
                }`}
              >
                {mockConnectedProviders.naver.connected ? '연동 완료' : '연동하기'}
              </button>
            </div>

            {/* 3. 카카오 연동 행 */}
            <div className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEE500]" />
                <span className="font-bold text-sm md:text-base text-txt-primary">카카오 (Kakao)</span>
                {mockConnectedProviders.kakao.connected && (
                  <span className="text-xs text-txt-muted hidden sm:inline">({mockConnectedProviders.kakao.email})</span>
                )}
              </div>
              <button
                onClick={() => handleConnectProvider('kakao')}
                disabled={mockConnectedProviders.kakao.connected}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
                  mockConnectedProviders.kakao.connected
                    ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20'
                    : 'bg-brand-main text-white hover:bg-brand-dark shadow-sm'
                }`}
              >
                {mockConnectedProviders.kakao.connected ? '연동 완료' : '연동하기'}
              </button>
            </div>
          </div>
        </div>

        {/* 하단 유틸리티 링크 바 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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

          <button 
            onClick={handleWithdrawal}
            className="text-xs font-bold text-txt-muted hover:text-red-500 underline underline-offset-4 transition-colors"
          >
            서비스 연동 해제 및 회원탈퇴
          </button>
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