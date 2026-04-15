import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/logos/Logo.webp';
import SearchIcon from '../assets/Search_B.svg';
import login from '../assets/Login_B.svg';

// ⭐ 공용 인증 클라이언트 불러오기
import { authClient } from '../auth-client'; 

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
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  // ⭐ 통합 검색을 위한 상태 (검색창 열림 여부, 검색어)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() === "") return;
    navigate(`/search?q=${encodeURIComponent(searchKeyword)}`);
    setIsSearchOpen(false); 
    setSearchKeyword(""); 
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
                    <span className="text-[11px] font-extrabold text-white bg-[#317F81] px-2 py-0.5 rounded-md">
                      {session.user.role}
                    </span>
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
              <button className="py-3 hover:text-[#317F81] transition-colors duration-200">
                {item.title}
              </button>
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

          {/* ⭐ 여기에 검색창과 돋보기 아이콘을 연결했습니다! */}
          <div className="relative flex items-center ml-[-10px]">
            <div className={`absolute right-8 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible w-48' : 'opacity-0 invisible w-0'}`}>
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 border border-[#317F81] rounded-full px-3 py-1.5 shadow-sm overflow-hidden">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="통합 검색..."
                  className="w-full text-sm outline-none bg-transparent"
                />
              </form>
            </div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="flex items-center hover:text-[#317F81] transition-colors z-10 bg-white p-1 rounded-full relative"
            >
              <img src={SearchIcon} alt="search" className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
