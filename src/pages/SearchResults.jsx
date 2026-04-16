import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const boardNames = {
  edu: "교육/세미나", publish: "논문/출판", pr: "홍보",
  manufacture: "제조업체 정보", construction: "시공업체 정보", consulting: "컨설팅업체 정보",
  forms: "인증 관련 서식", notice: "공지사항", qna: "문의상담", archive: "자료실",
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("검색 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex flex-col font-sans">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            <span className="text-[#317F81]">'{query}'</span> 검색 결과
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-t-2 border-gray-800">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                    <th className="py-4 w-24 text-center">게시판</th>
                    <th className="py-4 px-4 text-left">제목</th>
                    <th className="py-4 w-16 text-center">첨부</th>
                    <th className="py-4 w-24 text-center">작성자</th>
                    <th className="py-4 w-28 text-center">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-400">검색 중입니다...</td></tr>
                  ) : posts.length > 0 ? (
                    posts.map((post) => {
                      const hasImage = post.image_url && post.image_url !== "" && post.image_url !== "[]" && post.image_url !== '""';
                      return (
                        <tr key={post.id} onClick={() => navigate(`/board/${post.category}/${post.id}`)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                          <td className="py-4 text-center text-xs font-bold text-[#317F81]">{boardNames[post.category] || '기타'}</td>
                          <td className="py-4 px-4 font-medium text-gray-800">{post.title}</td>
                          <td className="py-4 text-center text-lg flex items-center justify-center gap-1">
                            {post.has_file === 1 && <span title="첨부파일">💾</span>}
                            {hasImage && <span title="사진 포함">🖼️</span>}
                          </td>
                          <td className="py-4 text-center text-sm text-gray-600">{post.author_name}</td>
                          <td className="py-4 text-center text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;