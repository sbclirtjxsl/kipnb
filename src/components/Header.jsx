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

  // ⭐ [추가됨] 문지기 배치: 페이지가 켜질 때마다 임시 출입증을 검사합니다.
  useEffect(() => {
    // 1. better-auth는 로그인 상태라고 넘겨주었지만...
    if (session?.user) {
      // 2. 브라우저의 '임시 출입증(app_session)'이 없다면? (창을 껐다 켰다는 확실한 증거!)
      if (!document.cookie.includes('app_session=active')) {
        // 3. 문지기가 강제로 로그아웃 API를 쏘고 새로고침 시켜버림
        authClient.signOut().then(() => {
          window.location.reload(); 
        });
      }
    }
  }, [session]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popularPosts, setPopularPosts] = useState([]); 

  useEffect(() => {
    if (isSearchOpen && popularPosts.length === 0) {
      fetch('/api/popular')
        .then(res => res.json())
        .then(data => setPopularPosts(data || []))
        .catch(err => console.error(err));
      
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
    setIsSearchOpen(false); 
    setSearchKeyword(""); 
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm relative">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="max-w-[900px] mx-auto">
            <div className="flex justify-between items-center py-0">
              <Link to="/" className="flex items-center">
                <img src={LogoImg} alt="사람과건축 로고" className="h-[50px] md:h-[55px] w-auto object-contain" />
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
                    <span className="text-gray-700">{session?.user?.name}님</span>
                    <button 
                      onClick={async () => { await authClient.signOut(); window.location.reload(); }}
                      className="ml-3 px-3 py-1 text-xs font-medium text-gray-500 border border-gray-300 rounded-full hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <div className="w-7 h-7 text-white rounded-full flex items-center justify-center text-[10px]">
                      <img src={login} alt="로그인"/>
                    </div>
                    <span>Log In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex justify-center items-center gap-10 text-[15.5px] font-bold relative pb-2">
            {menuItems.map((item, idx) => (
              <div key={idx} className="group relative">
                <button className="py-3 hover:text-[#317F81] transition-colors duration-200">{item.title}</button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 min-w-[180px] bg-white border shadow-xl rounded-lg py-3 z-[100]">
                  <div className="relative flex flex-col">
                    {item.sub.map((subItem, subIdx) => (
                      <Link key={subIdx} to={subItem.path} className="px-5 py-2 hover:bg-[#f0f9f9] hover:text-[#317F81] text-center text-sm text-gray-600 font-medium odd:bg-gray-100">
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => setIsSearchOpen(true)} className="flex items-center hover:text-[#317F81] transition-colors ml-[-10px] p-1">
              <img src={SearchIcon} alt="search" className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      <div 
        className={`fixed top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-[800px] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-out origin-top ${
          isSearchOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 md:p-6 border-b border-gray-100">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-gray-100 rounded-full px-5 py-3 hover:bg-gray-200 focus-within:bg-white focus-within:border-[#317F81] focus-within:ring-2 focus-within:ring-[#317F81]/20 transition-all border border-transparent">
            <img src={SearchIcon} alt="search" className="w-6 h-6 opacity-50 mr-3" />
            <input
              type="text"
              autoFocus={isSearchOpen}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="무엇을 찾고 싶으신가요?"
              className="w-full text-lg bg-transparent outline-none text-gray-900 font-medium placeholder-gray-400"
            />
            <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-3 text-gray-400 hover:text-gray-800 p-1">
              ✕
            </button>
          </form>
        </div>

        <div className="p-6 md:p-8 bg-gray-50/50">
          <h3 className="text-sm font-extrabold text-gray-800 mb-5">사람과건축 인기 게시글 🔥</h3>
          
          {popularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate(`/board/${post.category}/${post.id}`);
                  }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#317F81] hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#eef6f6] text-[#317F81] rounded-lg flex items-center justify-center font-bold text-xs">
                    {boardNames[post.category] ? boardNames[post.category].substring(0, 2) : '게시'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-gray-700 truncate group-hover:text-[#317F81] transition-colors">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">👀 조회수 {post.views}회</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-gray-400">인기 게시글을 불러오고 있습니다...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;