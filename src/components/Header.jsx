import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/logos/Logo.webp';
import SearchIcon from '../assets/Search_B.svg'; // 이름 변경: Loginimg -> SearchIcon
import login from '../assets/Login_B.svg';
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
      { name: "교육/세미나", path: "/board/edu" },
      { name: "논문/출판", path: "/board/publish" },
      { name: "홍보", path: "/board/pr" }
    ] 
  },
  { 
    title: "BF관련 업체정보", 
    sub: [
      { name: "제조", path: "/board/manufacture" },
      { name: "시공", path: "/board/construction" },
      { name: "컨설팅", path: "/board/consulting" }
    ] 
  },
  { 
    title: "장애물 없는 생활환경 인증", 
    sub: [
      { name: "BF 인증 개요", path: "/bf-info" },
      { name: "BF인증 종류및절차", path: "/bf-process" },
      { name: "인증수수료", path: "/bf-fee" },
      { name: "인증 신청 첨부물", path: "/bf-files" },
      { name: "인증 관련 서식", path: "/board/forms" }
    ] 
  },
  { 
    title: "게시판", 
    sub: [
      { name: "공지사항", path: "/board/notice" },
      { name: "문의상담", path: "/board/qna" }
    ] 
  },
  { 
    title: "자료실", 
    sub: [
      { name: "자료실", path: "/board/archive" }
    ] 
  },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="max-w-[900px] mx-auto">
          {/* 상단: 로고와 로그인 버튼만 유지 */}
          <div className="flex justify-between items-center py-0">
            <Link to="/" className="flex items-center">
              <img src={LogoImg} alt="사람과건축 로고" className="h-[50px] md:h-[55px] w-auto object-contain" />
            </Link>

            {/* 로그인은 우측 상단에 고정 */}
            <div className="flex items-center text-sm font-bold">
              <Link to="/login" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <div className="w-7 h-7 text-white rounded-full flex items-center justify-center text-[10px]">
                  <img src={login} alt="로그인"/>
                </div>
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
        {/* 하단 네비게이션: 메뉴들과 Search 아이콘 */}
        <nav className="hidden md:flex justify-center items-center gap-10 text-[15.5px] font-bold relative pb-2">
          {menuItems.map((item, idx) => (
            <div key={idx} className="group relative">
              <button className="py-3 hover:text-[#317F81] transition-colors duration-200">
                {item.title}
              </button>

              {/* 드롭다운 (기존 로직 유지) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 
                              invisible opacity-0 group-hover:visible group-hover:opacity-100 
                              transition-all duration-300 min-w-[180px] bg-white border shadow-xl rounded-lg py-3 z-[100]">
                <div className="relative flex flex-col">
                  {item.sub.map((subItem, subIdx) => (
                    <Link key={subIdx} to={subItem.path} className="px-5 py-2 hover:bg-[#f0f9f9] 
                    hover:text-[#317F81] text-center text-sm text-gray-600 font-medium odd:bg-gray-100">
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* [이동된 부분] 자료실 옆에 위치하는 Search 아이콘 */}
          <button className="flex items-center hover:text-[#317F81] transition-colors ml-[-10px]">
            <img src={SearchIcon} alt="search" className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;