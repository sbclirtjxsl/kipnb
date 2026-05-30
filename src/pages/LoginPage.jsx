import React, { useState } from 'react';
import LogoImg from '../assets/logos/Logo.webp';
import { authClient } from "../auth-client"; 

const LoginPage = () => {
  // ⭐ 로딩 상태를 관리하는 state 추가 (어떤 제공자로 로그인 중인지 저장)
  const [isLoading, setIsLoading] = useState(null);

  const snsLogins = [
    {
      id: 'naver',
      name: '네이버',
      color: 'bg-[#03C75A]',
      textColor: 'text-white',
      icon: 'N',
      action: async () => {
        setIsLoading('naver'); // ⭐ 로딩 시작
        try {
          document.cookie = "app_session=active; path=/;"; 
          await authClient.signIn.social({
            provider: "naver",
            callbackURL: "/",
          });
        } catch (error) {
          setIsLoading(null); // 에러 발생 시 로딩 해제
        }
      },
    },
    {
      id: 'kakao',
      name: '카카오',
      color: 'bg-[#FEE500]',
      textColor: 'text-[#191919]',
      icon: 'K',
      action: async () => {
        setIsLoading('kakao'); // ⭐ 로딩 시작
        try {
          document.cookie = "app_session=active; path=/;"; 
          await authClient.signIn.social({
            provider: "kakao",
            callbackURL: "/",
          });
        } catch (error) {
          setIsLoading(null);
        }
      },
    },
    {
      id: 'google',
      name: '구글',
      color: 'bg-white dark:bg-gray-100', 
      textColor: 'text-gray-600',
      icon: 'G',
      border: 'border border-bd-default', 
      action: async () => {
        setIsLoading('google'); // ⭐ 로딩 시작
        try {
          document.cookie = "app_session=active; path=/;"; 
          await authClient.signIn.social({
              provider: "google",
              callbackURL: "/", 
          });
        } catch (error) {
          setIsLoading(null);
        }
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 font-main bg-bg-base transition-colors duration-300">
      
      <div className="w-full max-w-[400px] bg-bg-surface rounded-3xl shadow-xl dark:shadow-[0_0_20px_rgba(0,0,0,0.3)] p-10 flex flex-col items-center border border-bd-default">
        
        <div className="mb-10 text-center">
          <img 
            src={LogoImg} 
            alt="사람과건축 로고" 
            className="h-12 mx-auto mb-4 object-contain auto-invert" 
          />
          <p className="text-txt-secondary text-sm font-medium tracking-tight">
            사람과건축 서비스 이용을 위해<br />로그인을 진행해 주세요.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {snsLogins.map((sns, idx) => (
            <button
              key={idx}
              onClick={sns.action}
              disabled={!!isLoading} // ⭐ 하나라도 로딩 중이면 모든 버튼 비활성화 (중복 클릭 방지)
              className={`w-full h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all hover:brightness-95 hover:shadow-md ${sns.color} ${sns.textColor} ${sns.border || ''} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {/* ⭐ 로딩 중인 버튼일 경우 스피너 아이콘과 텍스트 변경 */}
              {isLoading === sns.id ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </span>
              ) : (
                <>
                  <span className="mr-3 w-5 text-center font-black">{sns.icon}</span>
                  <span>{sns.name}로 시작하기</span>
                </>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-txt-muted leading-relaxed">
            로그인 시 사람과건축의 <br />
            <span className="underline cursor-pointer hover:text-brand-main">이용약관</span> 및 <span className="underline cursor-pointer hover:text-brand-main">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>
      </div>

      <button 
        onClick={() => window.history.back()}
        disabled={!!isLoading}
        className="mt-8 text-txt-muted text-sm hover:text-brand-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        돌아가기
      </button>
    </div>
  );
};

export default LoginPage;