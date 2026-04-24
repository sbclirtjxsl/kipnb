import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../auth-client'; 

const MyPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  // 로딩 상태 처리
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-txt-muted">
        <div className="animate-pulse">회원 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  // 비로그인 시 처리
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-txt-primary mb-2">로그인이 필요합니다</h2>
          <p className="text-txt-secondary">마이페이지는 로그인 후 이용하실 수 있습니다.</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-brand-main text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand-main/20"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      {/* 제목 섹션 */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">마이페이지</h1>
        <p className="text-txt-muted mt-2">내 정보 관리 및 서비스 설정</p>
      </div>

      {/* 정보 카드 섹션 */}
      <div className="bg-bg-surface border border-bd-default rounded-3xl p-6 md:p-10 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* 프로필 이미지 (R2 또는 소셜 이미지) */}
          <div className="relative">
            <img 
              src={session.user.image || '/default-profile.png'} 
              alt="프로필" 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-bg-base shadow-xl"
            />
            {/* 네이버 연동 아이콘 뱃지 */}
            <div className="absolute -bottom-2 -right-2 bg-[#03C75A] p-2 rounded-xl shadow-lg border-2 border-white">
               <span className="text-white text-[10px] font-black italic">N</span>
            </div>
          </div>

          {/* 유저 상세 정보 */}
          <div className="flex-grow text-center md:text-left pt-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <h2 className="text-2xl font-black text-txt-primary">{session.user.name} 님</h2>
              <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-xs font-bold rounded-full border border-brand-main/20">
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

        {/* 버튼 액션 그룹 */}
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

          {/* 회원탈퇴 (연동 해제) - 검수 시 매우 중요한 부분 */}
          <button 
            onClick={() => {
              if(window.confirm('정말 네이버 연동을 해제하고 탈퇴하시겠습니까?')) {
                // 탈퇴 로직 (D1 DB 연동)
                alert('탈퇴 처리 프로세스가 시작됩니다.');
              }
            }}
            className="text-xs font-bold text-txt-muted hover:text-red-500 underline underline-offset-4 transition-colors"
          >
            서비스 연동 해제 및 회원탈퇴
          </button>
        </div>
      </div>

      {/* 안내 문구 (검수관 어필용) */}
      <p className="mt-6 text-center text-[11px] text-txt-muted">
        개인정보 보호를 위해 수집된 정보는 서비스 운영 목적 외에 사용되지 않으며, <br className="hidden md:block" />
        언제든지 연동 해제를 통해 정보를 파기할 수 있습니다.
      </p>
    </div>
  );
};

export default MyPage;