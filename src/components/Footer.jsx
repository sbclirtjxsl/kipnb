import React from 'react';

const Footer = () => {
  return (
    /* 1. 배경색(bg-bg-footer)과 테두리(border-bd-default) 연동 */
    <footer className="bg-bg-footer pt-12 pb-16 border-t border-bd-default mt-20 transition-colors duration-300">
      <div className="max-w-[980px] mx-auto px-4">
        
        {/* 2. 제목 색상 (text-txt-primary) */}
        <h3 className="text-lg font-bold mb-6 text-txt-primary">Contact</h3>
        
        {/* 3. 본문 색상 (text-txt-secondary) 및 간격 조정 */}
        <div className="text-[14px] md:text-[15px] leading-relaxed text-txt-secondary space-y-2">
          <p className="font-semibold text-txt-primary">법인명 : 사단법인 사람과건축</p>
          
          <div className="flex flex-col md:flex-row md:gap-x-4 flex-wrap">
            <p>주소 : [31198] 충청남도 천안시 동남구 청수5로 9, 7층</p>
            <span className="hidden md:inline text-txt-muted">|</span>
            <p>전화번호 : 041 - 900 - 4980</p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-x-4 flex-wrap">
            <p>팩스번호 : 041 - 900 - 4981</p>
            <span className="hidden md:inline text-txt-muted">|</span>
            <p>이메일 : pbpb24@naver.com</p>
            <span className="hidden md:inline text-txt-muted">|</span>
            <p>사업자등록번호 : 739 - 82 - 00614</p>
          </div>

          {/* 4. 저작권 표시 (text-txt-muted) */}
          <p className="pt-8 font-medium text-[11px] md:text-xs text-txt-muted uppercase tracking-wider">
            COPYRIGHT© 2024 (사)사람과건축 ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;