import React from 'react';
import LogoImg from '../assets/logos/Logo.webp';
// ⭐ 기존에 있던 createAuthClient 부분은 지우고, 방금 만든 공용 파일을 불러옵니다.
import { authClient } from "../auth-client"; 

const LoginPage = () => {
  const snsLogins = [
    {
      name: '네이버',
      color: 'bg-[#03C75A]',
      textColor: 'text-white',
      icon: 'N',
      action: () => console.log('Naver Login'),
    },
    {
      name: '카카오',
      color: 'bg-[#FEE500]',
      textColor: 'text-[#191919]',
      icon: 'K',
      action: () => console.log('Kakao Login'),
    },
    {
      name: '구글',
      color: 'bg-white',
      textColor: 'text-gray-600',
      icon: 'G',
      border: 'border border-gray-200',
      // ⭐ 3. 주소창 이동 대신, 공식 로그인 함수 사용!
      action: async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/", // 로그인 성공 후 메인 화면으로 돌아오기
        });
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 font-main">
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center">
        
        <div className="mb-10 text-center">
          <img src={LogoImg} alt="사람과건축 로고" className="h-12 mx-auto mb-4 object-contain" />
          <p className="text-gray-400 text-sm font-medium tracking-tight">
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
          <p className="text-xs text-gray-400 leading-relaxed">
            로그인 시 사람과건축의 <br />
            <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>
      </div>

      <button 
        onClick={() => window.history.back()}
        className="mt-8 text-gray-400 text-sm hover:text-gray-600 transition-colors"
      >
        돌아가기
      </button>
    </div>
  );
};

export default LoginPage;