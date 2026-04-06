import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/Logo.png';

// 메뉴 데이터 구조를 이름(name)과 경로(path) 객체 배열로 변경합니다.
const menuItems = [
  { 
    title: "사람과건축 소개", 
    sub: [
      { name: "인사말", path: "/greeting" },
      { name: "사업분야", path: "/business" },
      { name: "업무담당자 안내", path: "/Soon" },
      { name: "오시는 길", path: "/location" }
    ] 
  },
  { 
    title: "연구 및 공익사업", 
    sub: [
      { name: "교육/세미나", path: "/board/edu" },      // edu 매칭
      { name: "논문/출판", path: "/board/publish" },   // publish 매칭
      { name: "홍보", path: "/board/pr" }             // pr 매칭
    ] 
  },
  { 
    title: "BF관련 업체정보", 
    sub: [
      { name: "제조", path: "/board/manufacture" },    // manufacture 매칭
      { name: "시공", path: "/board/construction" },   // construction 매칭
      { name: "컨설팅", path: "/board/consulting" }    // consulting 매칭
    ] 
  },
  { 
    title: "장애물 없는 생활환경 인증", 
    sub: [
      { name: "BF 인증 개요", path: "/bf-info" },
      { name: "BF인증 종류및절차", path: "/bf-process" },
      { name: "인증수수료", path: "/bf-fee" },
      { name: "인증 신청 첨부물", path: "/bf-files" },
      { name: "인증 관련 서식", path: "/board/forms" }   // forms 매칭
    ] 
  },
  { 
    title: "게시판", 
    sub: [
      { name: "공지사항", path: "/board/notice" },     // notice 매칭
      { name: "문의상담", path: "/board/qna" }        // qna 매칭
    ] 
  },
  { 
    title: "자료실", 
    sub: [
      { name: "자료실", path: "/board/archive" }      // archive 매칭
    ] 
  },
];

const Header = () => {
  return (
    <Header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="block">
            <img src={LogoImg} alt="사람과건축 로고" className="h-[55px] w-auto" />
          </Link>

          <div className="flex items-center gap-4 text-sm font-bold text-[#317F81]">
            <button className="flex items-center gap-1 hover:opacity-70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 26 26">
                <path d="M13 20.4 0 7.4l1.8-1.8L13 16.8 24.2 5.6 26 7.4z" transform="rotate(-90 13 13)"/>
              </svg>
              Search
            </button>
            <button className="flex items-center gap-1 hover:opacity-70">
              <div className="w-6 h-6 bg-[#317F81] text-white rounded-full flex items-center justify-center text-xs">👤</div>
              Log In
            </button>
          </div>
        </div>

        <nav className="hidden md:flex justify-center gap-10 text-[15.5px] font-bold relative">
          {menuItems.map((item, idx) => (
            <div key={idx} className="group relative py-3">
              {/* 상위 메뉴 클릭 시 일단 유지 (#) */}
              <Link to="#" className="hover:text-[#317F81] transition-colors duration-200">
                {item.title}
              </Link>

              {/* 중앙 정렬 드롭다운 박스 */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 
                              invisible opacity-0 group-hover:visible group-hover:opacity-100 
                              translate-y-2 group-hover:translate-y-0
                              transition-all duration-300 ease-out
                              min-w-[180px] bg-white border border-gray-100 shadow-xl rounded-lg py-3 z-[100]">
                {/* 드롭다운 상단 뿔 */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100"></div>
                
                <div className="relative flex flex-col items-center">
                  {item.sub.map((subItem, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subItem.path} // 수정: 실제 정의된 경로로 이동
                      className="w-full text-center px-4 py-2.5 text-[14px] text-gray-600 
                                hover:bg-[#f8fcfc] hover:text-[#317F81] transition-colors font-medium"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </Header>
  );
};

export default Header;