import React from 'react';
import LogoImg from '../assets/logos/Logo.webp';
import { authClient } from "../auth-client"; 

const LoginPage = () => {
  const snsLogins = [
    {
      name: '네이버',
      color: 'bg-[#03C75A]',
      textColor: 'text-white',
      icon: 'N',
      action: async () => {
        document.cookie = "app_session=active; path=/;"; 
        await authClient.signIn.social({
          provider: "naver",
          callbackURL: "/",
        });
      },
    },
    {
      name: '카카오',
      color: 'bg-[#FEE500]',
      textColor: 'text-[#191919]',
      icon: 'K',
      action: async () => {
        document.cookie = "app_session=active; path=/;"; 
        await authClient.signIn.social({
          provider: "kakao",
          callbackURL: "/",
        });
      },
    },
    {
      name: '구글',
      color: 'bg-white dark:bg-gray-100', // 다크모드에서도 구글 버튼 시인성 확보
      textColor: 'text-gray-600',
      icon: 'G',
      border: 'border border-bd-default', // App.css의 경계선 변수 사용
      action: async () => {
        document.cookie = "app_session=active; path=/;"; 
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/", 
        });
      },
    },
  ];

  return (
    // 전체 배경: bg-base (라이트: #fff / 다크: #242424)
    <div className="min-h-screen flex flex-col justify-center items-center p-6 font-main bg-bg-base transition-colors duration-300">
      
      {/* 카드 배경: bg-surface (라이트: #f9fafb / 다크: #3f3f3f) */}
      <div className="w-full max-w-[400px] bg-bg-surface rounded-3xl shadow-xl dark:shadow-[0_0_20px_rgba(0,0,0,0.3)] p-10 flex flex-col items-center border border-bd-default">
        
        <div className="mb-10 text-center">
          {/* 다크모드 로고 반전: App.css의 .auto-invert 또는 dark:invert 사용 */}
          <img 
            src={LogoImg} 
            alt="사람과건축 로고" 
            className="h-12 mx-auto mb-4 object-contain auto-invert" 
          />
          {/* 텍스트 색상: txt-secondary 또는 txt-muted 적용 */}
          <p className="text-txt-secondary text-sm font-medium tracking-tight">
            사람과건축 서비스 이용을 위해<br />로그인을 진행해 주세요.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {snsLogins.map((sns, idx) => (
            <button
              key={idx}
              onClick={sns.action}
              className={`w-full h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all hover:brightness-95 hover:shadow-md ${sns.color} ${sns.textColor} ${sns.border || ''}`}
            >
              <span className="mr-3 w-5 text-center font-black">{sns.icon}</span>
              <span>{sns.name}로 시작하기</span>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          {/* 하단 약관 텍스트: txt-muted 적용 */}
          <p className="text-xs text-txt-muted leading-relaxed">
            로그인 시 사람과건축의 <br />
            <span className="underline cursor-pointer hover:text-brand-main">이용약관</span> 및 <span className="underline cursor-pointer hover:text-brand-main">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>
      </div>

      <button 
        onClick={() => window.history.back()}
        className="mt-8 text-txt-muted text-sm hover:text-brand-main transition-colors"
      >
        돌아가기
      </button>
    </div>
  );
};

export default LoginPage;