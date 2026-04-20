import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-main pt-12 pb-16 border-t border-gray-300 mt-20">
      <div className="max-w-[980px] mx-auto px-4">
        <h3 className="text-lg font-bold mb-4">Contact</h3>
        <div className="text-[15px] leading-loose text-gray-600 space-y-1 text-sm md:text-base">
          <p>법인명 : 사단법인 사람과건축</p>
          <p>주소 : [31198] 충청남도 천안시 동남구 청수5로 9, 7층 | 전화번호 : 041 - 900 - 4980</p>
          <p>팩스번호 : 041 - 900 - 4981 | 이메일 : pbpb24@naver.com | 사업자등록번호 : 739 - 82 - 00614</p>
          <p className="pt-4 font-medium text-xs md:text-sm">COPYRIGHT© 2024(사)사람과건축 ALL RIGHT RESERVED</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;