import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoImg from '../assets/logos/Logo.webp';
import SearchIcon from '../assets/Search_B.svg';
import login from '../assets/Login_B.svg';
import { authClient } from '../auth-client'; 

const menuItems = [
  { title: "사람과건축 소개", sub: [{ name: "인사말", path: "/greeting" }, { name: "사업분야", path: "/business" }, { name: "업무담당자 안내", path: "/Soon" }, { name: "오시는 길", path: "/location" }] },
  { title: "연구 및 공익사업", sub: [{ name: "교육/세미나", path: "/board/edu" }, { name: "논문/출판", path: "/board/publish" }, { name: "홍보", path: "/board/pr" }] },
  { title: "BF관련 업체정보", sub: [{ name: "제조", path: "/board/manufacture" }, { name: "시공", path: "/board/construction" }, { name: "컨설팅", path: "/board/consulting" }] },
  { title: "장애물 없는 생활환경 인증", sub: [{ name: "BF 인증 개요", path: "/bf-info" }, { name: "BF인증 종류및절차", path: "/bf-process" }, { name: "인증수수료", path: "/bf-fee" }, { name: "인증 신청 첨부물", path: "/bf-files" }, { name: "인증 관련 서식", path: "/board/forms" }] },
  { title: "게시판", sub: [{ name: "공지사항", path: "/board/notice" }, { name: "문의상담", path: "/board/qna" }] },
  { title: "자료실", sub: [{ name: "자료실", path: "/board/archive" }] },
];

const boardNames = {
  edu: "교육/세미나", publish: "논문/출판", pr: "홍보",
  manufacture: "제조업체 정보", construction: "시공업체 정보", consulting: "컨설팅업체 정보",
  forms: "관련 서식", notice: "공지사항", qna: "문의상담", archive: "자료실",
};

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      if (!document.cookie.includes('app_session=active')) {
        authClient.signOut().then(() => { window.location.reload(); });
      }
    }
  }, [session]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popularPosts, setPopularPosts] = useState([]); 

  useEffect(() => {
    if (isSearchOpen && popularPosts.length === 0) {
      fetch('/api/popular').then(res => res.json()).then(data => setPopularPosts(data || [])).catch(err => console.error(err));
      document.body.style.overflow = 'hidden'; 
    } else if (!isSearchOpen) {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() === "") return;
    navigate(`/search?q=${encodeURIComponent(searchKeyword)}`);
    setIsSearchOpen(false); setSearchKeyword(""); 
  };

  return (
    <>
      {/* ⭐ 헤더 전체에 다크모드 배경색 적용 */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 shadow-sm relative transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="max-w-[900px] mx-auto">
            <div className="flex justify-between items-center py-0">
              <Link to="/" className="flex items-center">
                {/* ⭐ 까만 로고가 밤에 안 보이므로 dark:invert 로 하얗게 반전 */}
                <img src={LogoImg} alt="사람과건축 로고" className="h-[50px] md:h-[55px] w-auto object-contain dark:invert transition-all" />
              </Link>

              <div className="flex items-center text-sm font-bold">
                {isPending ? (
                  <span className="text-gray-400 font-medium text-xs">확인 중...</span>
                ) : session?.user ? (
                  <div className="flex items-center gap-2">
                    {session?.user?.role && (
                      <span className="text-[11px] font-extrabold text-white bg-[#317F81] px-2 py-0.5 rounded-md">{session.user.role}</span>
                    )}
                    <img src={session?.user?.image} alt="프로필" className="w-7 h-7 rounded-full border border-gray-200 shadow-sm" />
                    <span className="text-gray-700 dark:text-gray-200">{session?.user?.name}님</span>
                    <button onClick={async () => { await authClient.signOut(); window.location.reload(); }} className="ml-3 px-3 py-1 text-xs font-medium text-gray-500 border border-gray-300 rounded-full hover:bg-gray-50 hover:text-red-500 transition-colors">
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <div className="w-7 h-7 text-white rounded-full flex items-center justify-center text-[10px]">
                      {/* ⭐ 까만 아이콘 반전 */}
                      <img src={login} alt="로그인" className="dark:invert transition-all"/>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">Log In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex justify-center items-center gap-10 text-[15.5px] font-bold relative pb-2">
            {menuItems.map((item, idx) => (
              <div key={idx} className="group relative">
                {/* ⭐ 메뉴 글자색 다크모드 대응 */}
                <button className="py-3 text-gray-800 dark:text-gray-200 hover:text-[#317F81] dark:hover:text-[#4fd1d5] transition-colors duration-200">{item.title}</button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 min-w-[180px] bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-lg py-3 z-[100]">
                  <div className="relative flex flex-col">
                    {item.sub.map((subItem, subIdx) => (
                      <Link key={subIdx} to={subItem.path} className="px-5 py-2 hover:bg-[#f0f9f9] dark:hover:bg-gray-700 dark:text-gray-200 text-center text-sm text-gray-600 font-medium odd:bg-gray-100 dark:odd:bg-gray-800 transition-colors">
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => setIsSearchOpen(true)} className="flex items-center hover:text-[#317F81] transition-colors ml-[-10px] p-1">
              <img src={SearchIcon} alt="search" className="w-5 h-5 dark:invert transition-all" />
            </button>
          </nav>
        </div>
      </header>

      {/* 검색 모달 코드 (기존과 동일하여 생략, 다크모드 대응 필요 시 추가 작업 가능) */}
      {isSearchOpen && (<div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsSearchOpen(false)} />)}
      {/* ... (검색창 내부 코드는 길어서 생략했습니다. 그대로 두셔도 무방합니다!) ... */}
    </>
  );
};

export default Header;