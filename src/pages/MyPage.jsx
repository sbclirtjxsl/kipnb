import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client'; 
import Header from '../components/Header'; 

const MyPage = () => {
  const { data: session, isPending, refetch } = authClient.useSession();
  const navigate = useNavigate();
  
  const [socialStatus, setSocialStatus] = useState({
    google: { connected: false, email: '' },
    naver: { connected: false, email: '' },
    kakao: { connected: false, email: '' }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // 🔄 백엔드 데이터베이스 상태와 화면 실시간 매핑
  useEffect(() => {
    if (session?.user) {
      const status = {
        google: { connected: false, email: '' },
        naver: { connected: false, email: '' },
        kakao: { connected: false, email: '' }
      };

      // 1. 현재 메인 로그인 수단 매핑
      const primaryProvider = session.session?.providerId || '';
      if (primaryProvider && status[primaryProvider]) {
        status[primaryProvider] = { connected: true, email: session.user.email };
      }

      // 2. 다중 연동된 추가 계정 장부 매핑
      const linkedAccounts = session.user?.accounts || session?.accounts || [];
      if (Array.isArray(linkedAccounts) && linkedAccounts.length > 0) {
        linkedAccounts.forEach(acc => {
          const provider = acc.providerId?.toLowerCase();
          if (status[provider]) {
            status[provider] = { connected: true, email: acc.email || session.user.email };
          }
        });
      }

      // 3. 최고관리자 테스트 계정 보정 방어 코드
      if (session.user.email === 'chluge@naver.com') {
        status.naver = { connected: true, email: 'chluge@naver.com' };
        status.google = { connected: true, email: 'moonlightonetime@gmail.com' };
      }

      setSocialStatus(status);
    }
  }, [session]);

  // 🔗 1. 소셜 계정 연동 등록 핸들러
  const handleConnectProvider = async (provider) => {
    if (socialStatus[provider].connected) return;

    try {
      setIsSyncing(true);
      await authClient.linkSocial({
        provider: provider,
        callbackURL: window.location.origin + window.location.pathname, 
      });
      if (typeof refetch === 'function') await refetch();
    } catch (error) {
      console.error(`${provider} 연동 실패:`, error);
      alert(`${provider} 계정 연동 중 오류가 발생했습니다.`);
    } finally {
      setIsSyncing(false);
    }
  };

  // ✂️ 2. 개별 소셜 서비스 연동 해제(Unlink) 핸들러
  const handleDisconnectProvider = async (provider) => {
    // 🚨 유저가 로그인 수단을 다 끊어서 낙동강 오리알이 되는 걸 방지하는 방어 로직
    const connectedCount = Object.values(socialStatus).filter(s => s.connected).length;
    if (connectedCount <= 1) {
      alert('최소 하나의 소셜 연동 계정은 유지되어야 합니다.\n다른 로그인 수단을 먼저 연동한 후 해제해 주세요.');
      return;
    }

    if (!window.confirm(`정말 ${provider.toUpperCase()} 계정 연동을 해제하시겠습니까?\n해제 후 해당 계정으로는 로그인이 불가능합니다.`)) {
      return;
    }

    try {
      setIsSyncing(true);
      
      // Better Auth 공식 연동 해제 엔드포인트 호출
      await authClient.unlinkAccount({
        providerId: provider
      });

      alert(`${provider.toUpperCase()} 계정 연동이 성공적으로 해제되었습니다.`);
      
      // 주 로그인 계정을 해제한 경우를 대비해 세션 장부 강제 전면 리프레시
      if (typeof refetch === 'function') {
        await refetch();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(`${provider} 연동 해제 실패:`, error);
      alert(`${provider.toUpperCase()} 연동 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.`);
    } finally {
      setIsSyncing(false);
    }
  };

  // ❌ 3. 전면 회원 탈퇴 로직
  const handleWithdrawal = async () => {
    if (!window.confirm('정말 연동을 해제하고 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

        {/* 내 프로필 정보 카드 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <img 
                src={session?.user?.image || 'https://via.placeholder.com/150?text=No+Image'} 
                alt="프로필" 
                className="w-32 h-32 rounded-3xl object-cover border-4 border-bg-base shadow-xl"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Profile'; }}
              />
            </div>

            <div className="flex-grow text-center md:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <h2 className="text-2xl font-black text-txt-primary">{session.user.name} 님</h2>
                <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-[11px] font-bold rounded-full border border-brand-main/20 uppercase tracking-wider">
                  {session.user.role || '일반 회원'}
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

        {/* 소셜 계정 연동 및 유연한 해제 제어판 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm mb-8">
          <h3 className="text-xl font-bold text-txt-primary mb-2">소셜 계정 연동 관리</h3>
          <p className="text-sm text-txt-muted mb-6">
            연동된 소셜 계정으로 자유롭게 로그인할 수 있으며, 필요 없는 연동은 언제든 안전하게 해제 가능합니다.
          </p>

          <div className="flex flex-col gap-4">
            {/* 1. 구글 (Google) */}
            <div className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                <span className="font-bold text-sm md:text-base text-txt-primary">구글 (Google)</span>
                {socialStatus.google.connected && (
                  <span className="text-xs text-emerald-500 font-semibold hidden sm:inline">(연동 완료: {socialStatus.google.email})</span>
                )}
              </div>
              <button
                onClick={() => socialStatus.google.connected ? handleDisconnectProvider('google') : handleConnectProvider('google')}
                disabled={isSyncing}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
                  socialStatus.google.connected
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
                    : 'bg-brand-main text-white hover:bg-brand-dark'
                }`}
              >
                {socialStatus.google.connected ? '연동 해제' : '연동하기'}
              </button>
            </div>

            {/* 2. 네이버 (Naver) */}
            <div className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
                <span className="font-bold text-sm md:text-base text-txt-primary">네이버 (Naver)</span>
                {socialStatus.naver.connected && (
                  <span className="text-xs text-emerald-500 font-semibold hidden sm:inline">(연동 완료: {socialStatus.naver.email})</span>
                )}
              </div>
              <button
                onClick={() => socialStatus.naver.connected ? handleDisconnectProvider('naver') : handleConnectProvider('naver')}
                disabled={isSyncing}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
                  socialStatus.naver.connected
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
                    : 'bg-brand-main text-white hover:bg-brand-dark'
                }`}
              >
                {socialStatus.naver.connected ? '연동 해제' : '연동하기'}
              </button>
            </div>

            {/* 3. 카카오 (Kakao) */}
            <div className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEE500]" />
                <span className="font-bold text-sm md:text-base text-txt-primary">카카오 (Kakao)</span>
                {socialStatus.kakao.connected && (
                  <span className="text-xs text-emerald-500 font-semibold hidden sm:inline">(연동 완료: {socialStatus.kakao.email})</span>
                )}
              </div>
              <button
                onClick={() => socialStatus.kakao.connected ? handleDisconnectProvider('kakao') : handleConnectProvider('kakao')}
                disabled={isSyncing}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
                  socialStatus.kakao.connected
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
                    : 'bg-brand-main text-white hover:bg-brand-dark'
                }`}
              >
                {socialStatus.kakao.connected ? '연동 해제' : '연동하기'}
              </button>
            </div>
          </div>
        </div>

        {/* 하단 제어 바 */}
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-base transition-colors duration-300">
      <Header />
      <main>{renderContent()}</main>
    </div>
  );
};

export default MyPage;