import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client'; 
import Header from '../components/Header'; 

// 확장성을 고려하여 소셜 프로바이더 정보를 상수로 분리
const SOCIAL_PROVIDERS = [
  { id: 'google', name: '구글 (Google)', color: 'bg-[#EA4335]' },
  { id: 'naver', name: '네이버 (Naver)', color: 'bg-[#03C75A]' },
  { id: 'kakao', name: '카카오 (Kakao)', color: 'bg-[#FEE500]' }
];

// ⭐ 계급 척도 정의 (UI 권한 제어 및 하극상 방지용)
const ROLE_LEVELS = {
  '최고 관리자': 5,
  '관리자': 4,
  '운영진': 3,
  '우수 회원': 2,
  '일반 회원': 1
};

const MyPage = () => {
  const { data: session, isPending, refetch } = authClient.useSession();
  const navigate = useNavigate();
  
  // 프로바이더 상수를 기반으로 초기 상태 동적 생성
  const initialSocialStatus = SOCIAL_PROVIDERS.reduce((acc, provider) => {
    acc[provider.id] = { connected: false, email: '' };
    return acc;
  }, {});

  const [socialStatus, setSocialStatus] = useState(initialSocialStatus);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [fetchError, setFetchError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // UX 개선을 위한 커스텀 상태 (Alert/Confirm 대체)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [modal, setModal] = useState({ isOpen: false, type: null, target: null, confirmText: '' });

  // ⭐ 관리자 전용 상태 추가
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // 내 계급 수치화 및 관리자 여부 판별
  const myLevel = ROLE_LEVELS[session?.user?.role] || 1;
  const isAdmin = myLevel >= 3;

  // 토스트 알림 헬퍼 함수
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'info' }), 3000);
  };

  // 공통 API Fetch 헬퍼
  const fetchWithSecurity = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', 
      ...options.headers,
    };
    return fetch(url, { ...options, headers, credentials: 'include' });
  };

  // 1. 연동 목록 로드
  const loadLinkedAccounts = useCallback(async (signal) => {
    if (!session?.user) return;
    
    try {
      setFetchError(false);
      const response = await fetchWithSecurity('/api/auth/accounts', { method: 'GET', signal });
      
      if (!response.ok) throw new Error('API_FAILED');
      
      const resData = await response.json();
      const newStatus = { ...initialSocialStatus };

      if (Array.isArray(resData.accounts)) {
        resData.accounts.forEach(acc => {
          const provider = acc.providerId?.toLowerCase();
          if (newStatus[provider] !== undefined) {
            newStatus[provider] = { 
              connected: true, 
              email: acc.email || `${provider.toUpperCase()} 연동 계정` 
            };
          }
        });
      }
      
      if (!signal?.aborted) setSocialStatus(newStatus);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("연동 목록 로드 실패:", error);
        if (!signal?.aborted) setFetchError(true);
      }
    }
  }, [session?.user]);

  // ⭐ 2. 관리자일 경우 전체 회원 목록 로드
  const loadAdminUsers = useCallback(async (signal) => {
    if (!isAdmin) return;
    setIsLoadingUsers(true);
    try {
      const response = await fetchWithSecurity('/api/auth/users', { method: 'GET', signal });
      if (response.ok) {
        const data = await response.json();
        if (data.success && !signal?.aborted) {
          setAdminUsers(data.users);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("회원 목록 로드 실패:", error);
        showToast('회원 목록을 불러오지 못했습니다.', 'error');
      }
    } finally {
      if (!signal?.aborted) setIsLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate('/login', { replace: true });
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if (!session?.user) return;
    const controller = new AbortController();
    loadLinkedAccounts(controller.signal);
    loadAdminUsers(controller.signal); // 컴포넌트 마운트 시 회원 목록도 함께 호출
    return () => controller.abort();
  }, [session?.user, loadLinkedAccounts, loadAdminUsers]);

  // 연동하기 로직
  const handleConnectProvider = async (provider) => {
    if (socialStatus[provider].connected) return;
    try {
      setIsSyncing(true);
      await authClient.linkSocial({
        provider: provider,
        callbackURL: window.location.origin + window.location.pathname, 
      });
    } catch (error) {
      showToast('계정 연동 중 일시적인 오류가 발생했습니다.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // 연동 해제 요청 (모달 오픈)
  const requestDisconnect = (provider) => {
    const connectedCount = Object.values(socialStatus).filter(s => s.connected).length;
    if (connectedCount <= 1) {
      showToast('최소 하나의 소셜 연동 계정은 유지되어야 합니다.', 'error');
      return;
    }
    setModal({ isOpen: true, type: 'DISCONNECT', target: provider, confirmText: '' });
  };

  // 실제 연동 해제 실행
  const executeDisconnect = async () => {
    const provider = modal.target;
    setModal({ isOpen: false, type: null, target: null, confirmText: '' });
    
    try {
      setIsSyncing(true);
      const response = await fetchWithSecurity('/api/auth/unlink', {
        method: 'POST',
        body: JSON.stringify({ providerId: provider }),
      });

      if (response.ok) {
        showToast(`${provider.toUpperCase()} 연동이 해제되었습니다.`, 'success');
        setSocialStatus(prev => ({
          ...prev,
          [provider]: { connected: false, email: '' }
        }));
        if (typeof refetch === 'function') refetch();
      } else {
        throw new Error('UNLINK_FAILED');
      }
    } catch (error) {
      showToast('연동 해제에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // 회원 탈퇴 요청 (모달 오픈)
  const requestWithdrawal = () => {
    setModal({ isOpen: true, type: 'WITHDRAW', target: null, confirmText: '' });
  };

  // 실제 회원 탈퇴 실행
  const executeWithdrawal = async () => {
    if (modal.confirmText !== '탈퇴합니다') {
      showToast('정확한 확인 문구를 입력해주세요.', 'error');
      return;
    }

    try {
      setIsSyncing(true);
      const response = await fetchWithSecurity('/api/auth/withdraw', { method: 'POST' });

      if (response.ok) {
        await authClient.signOut();
        alert('그동안 이용해 주셔서 감사합니다. 탈퇴가 완료되었습니다.'); 
        window.location.replace('/'); 
      } else {
        throw new Error('WITHDRAW_FAILED');
      }
    } catch (error) {
      showToast('탈퇴 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.', 'error');
      setIsSyncing(false);
      setModal({ isOpen: false, type: null, target: null, confirmText: '' });
    }
  };

  // ⭐ 회원 등급 변경 실행 (API 연동 준비 완료)
  const handleRoleChange = async (userId, newRole) => {
    try {
      // API가 아직 없으므로 선반영(Optimistic Update)만 실행하여 UI 테스트부터 진행
      // API 완성 후 아래 주석을 풀 예정입니다.
      /*
      const response = await fetchWithSecurity('/api/auth/update-role', {
        method: 'POST',
        body: JSON.stringify({ userId, newRole })
      });
      if (!response.ok) throw new Error('ROLE_UPDATE_FAILED');
      */
      
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`등급이 '${newRole}'(으)로 변경되었습니다.`, 'success');
    } catch (error) {
      showToast('등급 변경 중 오류가 발생했습니다.', 'error');
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-txt-muted">
        <div className="animate-pulse font-main">회원 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!session?.user) return null;

  const profileImgSrc = (!imgError && session?.user?.image) 
    ? session.user.image 
    : 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="min-h-screen bg-bg-base transition-colors duration-300 relative">
      <Header />
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className={`px-6 py-3 rounded-full shadow-lg text-sm font-bold text-white ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-brand-main'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Custom Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-surface w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-txt-primary mb-4">
              {modal.type === 'DISCONNECT' ? '연동 해제 확인' : '회원 탈퇴 확인'}
            </h3>
            
            {modal.type === 'DISCONNECT' ? (
              <p className="text-txt-secondary text-sm mb-6 leading-relaxed">
                정말 <b>{modal.target?.toUpperCase()}</b> 계정 연동을 해제하시겠습니까?<br/>
                해제 후 해당 계정으로는 로그인이 불가능합니다.
              </p>
            ) : (
              <div className="mb-6">
                <p className="text-red-500 text-sm font-bold mb-3">
                  탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                </p>
                <p className="text-txt-secondary text-sm mb-2">동의하신다면 아래 입력창에 <b>탈퇴합니다</b> 라고 입력해주세요.</p>
                <input 
                  type="text"
                  placeholder="탈퇴합니다"
                  value={modal.confirmText}
                  onChange={(e) => setModal({ ...modal, confirmText: e.target.value })}
                  className="w-full px-4 py-2 border border-bd-default rounded-xl bg-bg-base text-txt-primary focus:outline-none focus:border-brand-main"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setModal({ isOpen: false, type: null, target: null, confirmText: '' })}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-bg-base border border-bd-default text-txt-secondary hover:bg-bg-surface-hover"
              >
                취소
              </button>
              <button 
                onClick={modal.type === 'DISCONNECT' ? executeDisconnect : executeWithdrawal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                {modal.type === 'DISCONNECT' ? '해제하기' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 테이블이 들어갈 공간을 위해 max-w를 1000px로 소폭 확대 */}
      <main className="max-w-[1000px] mx-auto px-4 py-12 font-main">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">마이페이지</h1>
          <p className="text-txt-muted mt-2">내 정보 관리 및 서비스 설정</p>
        </div>

        {/* 프로필 섹션 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img 
              src={profileImgSrc} 
              alt="프로필" 
              onError={() => setImgError(true)}
              className="w-32 h-32 rounded-3xl object-cover border-4 border-bg-base shadow-xl"
            />
            <div className="flex-grow text-center md:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <h2 className="text-2xl font-black text-txt-primary">{session.user.name} 님</h2>
                <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-[11px] font-bold rounded-full border border-brand-main/20 uppercase tracking-wider">
                  {session.user.role || '일반 회원'}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-txt-secondary">
                <span className="text-xs font-bold text-txt-muted w-16 uppercase">이메일</span>
                <span className="text-sm font-medium">{session.user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 소셜 연동 섹션 */}
        <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm mb-8">
          <h3 className="text-xl font-bold text-txt-primary mb-2">소셜 계정 연동 관리</h3>
          <p className="text-sm text-txt-muted mb-6">
            연동된 소셜 계정으로 자유롭게 로그인할 수 있으며, 필요 없는 연동은 언제든 안전하게 해제 가능합니다.
          </p>

          {fetchError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              연동된 계정 정보를 불러오지 못했습니다. 새로고침을 진행해주세요.
            </div>
          )}

          <div className="flex flex-col gap-4">
            {SOCIAL_PROVIDERS.map(({ id, name, color }) => {
              const status = socialStatus[id];
              return (
                <div key={id} className="flex items-center justify-between p-4 bg-bg-base rounded-2xl border border-bd-default">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="font-bold text-sm md:text-base text-txt-primary">{name}</span>
                    {status.connected && (
                      <span className="text-xs text-emerald-500 font-semibold hidden sm:inline">(연동 완료)</span>
                    )}
                  </div>
                  <button
                    onClick={() => status.connected ? requestDisconnect(id) : handleConnectProvider(id)}
                    disabled={isSyncing || fetchError}
                    className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
                      status.connected
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-50'
                        : 'bg-brand-main text-white hover:bg-brand-dark disabled:opacity-50'
                    }`}
                  >
                    {status.connected ? '연동 해제' : '연동하기'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ⭐ 관리자 전용: 회원 목록 섹션 (새로 추가됨) */}
        {isAdmin && (
          <div className="bg-bg-surface border border-brand-main/30 rounded-3xl p-6 md:p-10 shadow-sm mb-8 overflow-hidden">
            <div className="mb-6 border-b border-bd-default pb-4">
              <h3 className="text-xl font-extrabold text-brand-main flex items-center gap-2">
                👑 관리자 전용: 전체 회원 목록
              </h3>
              <p className="text-sm text-txt-muted mt-2">나보다 하위 등급의 회원만 권한을 변경할 수 있습니다.</p>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-10 text-txt-muted font-bold animate-pulse">회원 장부를 불러오는 중입니다...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-bg-base text-txt-secondary text-sm border-b border-bd-default">
                      <th className="p-4 font-bold rounded-tl-xl">이름</th>
                      <th className="p-4 font-bold">이메일</th>
                      <th className="p-4 font-bold text-center">연동 수단</th>
                      <th className="p-4 font-bold">가입일</th>
                      <th className="p-4 font-bold text-center rounded-tr-xl">현재 등급 관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map(user => {
                      const targetLevel = ROLE_LEVELS[user.role] || 1;
                      // 하극상 방지: 타겟 유저의 계급이 내 계급과 같거나 높으면 변경 불가!
                      const canManage = myLevel > targetLevel; 
                      
                      return (
                        <tr key={user.id} className="border-b border-bd-default hover:bg-bg-base transition-colors text-sm">
                          <td className="p-4 font-bold text-txt-primary">{user.name}</td>
                          <td className="p-4 text-txt-secondary">{user.email}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1 flex-wrap">
                              {user.providers && user.providers.map(p => {
                                const providerInfo = SOCIAL_PROVIDERS.find(sp => sp.id === p);
                                const bgColor = providerInfo ? providerInfo.color : 'bg-gray-500';
                                const textColor = p === 'kakao' ? 'text-black' : 'text-white';
                                return (
                                  <span key={p} className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${bgColor} ${textColor}`}>
                                    {p}
                                  </span>
                                )
                              })}
                            </div>
                          </td>
                          <td className="p-4 text-txt-muted text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            <select 
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              disabled={!canManage}
                              className={`text-xs font-bold rounded-lg px-3 py-2 border outline-none ${
                                canManage 
                                  ? 'bg-bg-surface border-brand-main text-brand-main cursor-pointer hover:bg-brand-main/5' 
                                  : 'bg-bg-base border-bd-default text-txt-muted cursor-not-allowed opacity-60'
                              }`}
                            >
                              <option value="최고 관리자">최고 관리자</option>
                              <option value="관리자">관리자</option>
                              <option value="운영진">운영진</option>
                              <option value="우수 회원">우수 회원</option>
                              <option value="일반 회원">일반 회원</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
                navigate('/', { replace: true });
              }}
              className="px-6 py-2.5 bg-bg-base border border-bd-default text-txt-secondary text-sm font-bold rounded-xl hover:bg-bg-surface-hover transition-colors"
            >
              로그아웃
            </button>
          </div>

          <button 
            onClick={requestWithdrawal}
            disabled={isSyncing}
            className="text-xs font-bold text-txt-muted hover:text-red-500 underline underline-offset-4 transition-colors disabled:opacity-50"
          >
            서비스 연동 해제 및 회원탈퇴
          </button>
        </div>
      </main>
    </div>
  );
};

export default MyPage;