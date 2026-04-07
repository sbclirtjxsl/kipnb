import React from 'react';
import LogoImg from '../assets/logos/Logo.webp';

const LoginPage = () => {
  // SNS 로그인 버튼 데이터
  const snsLogins = [
    {
      name: '네이버',
      color: 'bg-[#03C75A]',
      textColor: 'text-white',
      icon: 'N', // 실제로는 이미지를 넣으시면 됩니다.
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
      action: () => console.log('Google Login'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 font-main">
      {/* 로그인 카드 상자 */}
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center">
        
        {/* 로고 영역 */}
        <div className="mb-10 text-center">
          <img src={LogoImg} alt="사람과건축 로고" className="h-12 mx-auto mb-4 object-contain" />
          <p className="text-gray-400 text-sm font-medium tracking-tight">
            사람과건축 서비스 이용을 위해<br />로그인을 진행해 주세요.
          </p>
        </div>

        {/* SNS 로그인 버튼 리스트 */}
        <div className="w-full flex flex-col gap-3">
          {snsLogins.map((sns, idx) => (
            <button
              key={idx}
              onClick={sns.action}
              className={`w-full h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all hover:brightness-95 hover:shadow-md ${sns.color} ${sns.textColor} ${sns.border || ''}`}
            >
              {/* 아이콘 영역 (임시 텍스트 아이콘) */}
              <span className="mr-3 w-5 text-center font-black">{sns.icon}</span>
              <span>{sns.name}로 시작하기</span>
            </button>
          ))}
        </div>

        {/* 하단 안내문 */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            로그인 시 사람과건축의 <br />
            <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
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