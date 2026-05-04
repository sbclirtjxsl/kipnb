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

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popularPosts, setPopularPosts] = useState([]); 
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ 추가: 모바일 슬라이드 메뉴 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState(null); // 모바일 아코디언 메뉴

  useEffect(() => {
    if (session?.user) {
      if (!document.cookie.includes('app_session=active')) {
        authClient.signOut().then(() => {
          window.location.reload(); 
        });
      }
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-menu-item')) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // ✅ 수정: 검색창 및 모바일 메뉴 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isSearchOpen && popularPosts.length === 0) {
      fetch('/api/popular')
        .then(res => res.json())
        .then(data => setPopularPosts(data || []))
        .catch(err => console.error(err));
    }
    
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen, isMobileMenuOpen]);

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/board?category=search&search=${encodeURIComponent(searchKeyword)}`)
        .then(res => res.json())
        .then(data => {
          if (data.posts && data.posts.length > 0) {
            const seen = new Set();
            const filtered = [];
            for (const post of data.posts) {
              if (!seen.has(post.title)) {
                seen.add(post.title);
                filtered.push({
                  id: post.id,
                  title: post.title,
                  category: post.category || 'notice'
                });
              }
            }
            setSuggestions(filtered.slice(0, 5));
          } else {
            setSuggestions([]);
          }
        })
        .catch(err => {
          console.error("추천 검색어 로드 실패:", err);
          setSuggestions([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() === "") return;
    
    navigate(`/board/search?q=${encodeURIComponent(searchKeyword)}`);
    setIsSearchOpen(false); 
    setSearchKeyword(""); 
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg-header border-b border-bd-default shadow-sm relative transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="max-w-[900px] mx-auto">
            {/* ✅ 수정: 모바일에서 버튼들이 잘 정렬되도록 감싸줌 */}
            <div className="flex justify-between items-center py-2 md:py-0">
              <Link to="/" className="flex items-center">
                <img src={LogoImg} alt="사람과건축 로고" className="h-[40px] md:h-[55px] w-auto object-contain auto-invert transition-all duration-300" />
              </Link>

              <div className="flex items-center gap-3 md:gap-0">
                <div className="flex items-center text-sm font-bold">
                  {isPending ? (
                    <span className="text-txt-muted font-medium text-xs">확인 중...</span>
                  ) : session?.user ? (
                    <div className="flex items-center gap-2">
                      {session?.user?.role && (
                        <span className="hidden md:inline-block text-[11px] font-extrabold text-txt-inverse bg-brand-main px-2 py-0.5 rounded-md">{session.user.role}</span>
                      )}
                      
                      <div 
                        onClick={() => navigate('/mypage')}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <img 
                          src={session?.user?.image} 
                          alt="프로필" 
                          className="w-7 h-7 rounded-full border border-bd-default shadow-sm group-hover:border-brand-main transition-colors" 
                        />
                        <span className="hidden sm:inline-block text-txt-primary group-hover:text-brand-main transition-colors">
                          {session?.user?.name}님
                        </span>
                      </div>

                      <button 
                        onClick={async () => { await authClient.signOut(); window.location.reload(); }}
                        className="hidden md:block ml-3 px-3 py-1 text-xs font-medium text-txt-secondary border border-bd-strong rounded-full hover:bg-bg-surface-hover hover:text-red-500 transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                      <div className="w-7 h-7 text-txt-inverse rounded-full flex items-center justify-center text-[10px]">
                        <img src={login} alt="로그인" className="auto-invert transition-all duration-300" />
                      </div>
                      <span className="hidden sm:block text-txt-primary">Log In</span>
                    </Link>
                  )}
                </div>

                {/* ✅ 추가: 모바일 전용 아이콘 (검색 + 햄버거 메뉴) */}
                <div className="flex items-center gap-1 md:hidden">
                  <button onClick={() => setIsSearchOpen(true)} className="p-2">
                    <img src={SearchIcon} alt="search" className="w-5 h-5 auto-invert" />
                  </button>
                  <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-txt-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 데스크톱 메뉴 (그대로 유지) */}
          <nav className="hidden md:flex justify-center items-center gap-10 text-[15.5px] font-bold relative pb-2">
            {menuItems.map((item, idx) => (
              <div 
                key={idx} 
                className="relative nav-menu-item"
                onMouseEnter={() => setOpenMenuIndex(idx)}
                onMouseLeave={() => setOpenMenuIndex(null)}
              >
                <button 
                  onClick={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
                  className={`py-3 transition-colors duration-200 ${
                    openMenuIndex === idx 
                      ? "text-brand-main" 
                      : "text-txt-primary hover:text-brand-main"
                  }`}
                >
                  {item.title}
                </button>
                
                <div className={`absolute top-full left-1/2 -translate-x-1/2 transition-all duration-300 min-w-[180px] bg-bg-dropdown border border-bd-dropdown shadow-xl rounded-lg py-3 z-[100] ${
                  openMenuIndex === idx 
                    ? "visible opacity-100 translate-y-0" 
                    : "invisible opacity-0 translate-y-2 pointer-events-none"
                }`}>
                  <div className="relative flex flex-col">
                    {item.sub.map((subItem, subIdx) => (
                      <Link 
                        key={subIdx} 
                        to={subItem.path} 
                        onClick={() => setOpenMenuIndex(null)}
                        className="px-5 py-2 hover:bg-bg-dropdown-hover hover:text-brand-main text-center text-sm text-txt-secondary font-medium transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => setIsSearchOpen(true)} className="flex items-center hover:text-brand-main transition-colors ml-[-10px] p-1">
              <img src={SearchIcon} alt="search" className="w-5 h-5 auto-invert transition-all duration-300" />
            </button>
          </nav>
        </div>
      </header>

      {/* ✅ 추가: 모바일 전용 오른쪽 슬라이드 메뉴 패널 */}
      {/* 배경 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 오른쪽에서 나오는 사이드바 */}
      <div className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-bg-surface shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* 사이드바 헤더 */}
        <div className="flex justify-between items-center p-5 border-b border-bd-default">
          <span className="font-bold text-lg text-txt-primary">전체 메뉴</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-txt-muted hover:text-txt-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 사이드바 본문 (아코디언 메뉴) */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item, idx) => (
              <li key={idx} className="border-b border-bd-subtle pb-2">
                <button 
                  onClick={() => setMobileOpenIndex(mobileOpenIndex === idx ? null : idx)}
                  className="flex justify-between items-center w-full py-3 text-left font-bold text-txt-primary"
                >
                  {item.title}
                  {/* 펼치기/접기 화살표 아이콘 */}
                  <svg className={`w-5 h-5 text-txt-muted transition-transform duration-300 ${mobileOpenIndex === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* 서브 메뉴 목록 */}
                <div className={`overflow-hidden transition-all duration-300 ${mobileOpenIndex === idx ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <ul className="flex flex-col gap-1 pl-2 pb-2 bg-bg-base/50 rounded-lg">
                    {item.sub.map((subItem, subIdx) => (
                      <li key={subIdx}>
                        <Link 
                          to={subItem.path} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-txt-secondary hover:text-brand-main active:bg-bg-surface-hover rounded-md"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 기존 검색 모달 영역 (그대로 유지) */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* 검색창 모달 컨테이너 (그대로 유지, z-index만 60으로 약간 올림) */}
      <div 
        className={`fixed top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-[800px] bg-bg-surface rounded-3xl shadow-2xl z-[70] overflow-hidden transition-all duration-300 ease-out origin-top border border-bd-default ${
          isSearchOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 md:p-6 border-b border-bd-default">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-bg-base rounded-full px-5 py-3 hover:bg-bg-surface-hover focus-within:bg-bg-surface focus-within:border-brand-main focus-within:ring-2 focus-within:ring-brand-main/20 transition-all border border-transparent">
            <img src={SearchIcon} alt="search" className="w-6 h-6 opacity-50 mr-3 auto-invert" />
            <input
              type="text"
              autoFocus={isSearchOpen}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="무엇을 찾고 싶으신가요?"
              className="w-full text-lg bg-transparent outline-none text-txt-primary font-medium placeholder-txt-muted"
            />
            <button 
              type="button" 
              onClick={() => {
                if (searchKeyword.trim() !== "") setSearchKeyword("");
                else setIsSearchOpen(false);
              }} 
              className="ml-3 text-txt-muted hover:text-txt-primary p-1 transition-colors"
            >
              ✕
            </button>
          </form>
        </div>

        <div className="p-6 md:p-8 bg-bg-base/50">
          {searchKeyword.trim() !== "" ? (
            <div>
              <h3 className="text-sm font-extrabold text-txt-primary mb-5">추천 검색어 💡</h3>
              {suggestions.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {suggestions.map((suggestion, idx) => (
                    <li 
                      key={idx}
                      onClick={() => {
                        if (suggestion.id && suggestion.category) navigate(`/board/${suggestion.category}/${suggestion.id}`);
                        else navigate(`/board/search?q=${encodeURIComponent(suggestion.title || suggestion)}`);
                        setIsSearchOpen(false);
                        setSearchKeyword("");
                      }}
                      className="flex items-center cursor-pointer text-sm font-medium text-txt-secondary hover:text-brand-main p-2.5 hover:bg-bg-surface rounded-lg transition-all"
                    >
                      <img src={SearchIcon} alt="search" className="w-4 h-4 mr-3 opacity-40 auto-invert" />
                      {suggestion.title || suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-sm text-txt-muted">
                  해당 단어가 포함된 게시글이 없습니다.
                </div>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-sm font-extrabold text-txt-primary mb-5">사람과건축 인기 게시글 🔥</h3>
              {popularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {popularPosts.map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/board/${post.category}/${post.id}`);
                      }}
                      className="flex items-center gap-3 p-3 bg-bg-surface rounded-xl border border-bd-subtle hover:border-brand-main shadow-sm hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-brand-light text-brand-main rounded-lg flex items-center justify-center font-bold text-xs transition-colors">
                        {boardNames[post.category] ? boardNames[post.category].substring(0, 2) : '게시'}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-txt-primary truncate group-hover:text-brand-main transition-colors">{post.title}</p>
                        <p className="text-xs text-txt-muted mt-0.5">👀 조회수 {post.views}회</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-txt-muted">인기 게시글을 불러오고 있습니다...</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;