// ... 상단 import 생략 (기존과 동일)

const BoardEdit = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  
  // 관리자 권한 확인
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === '관리자' || session?.user?.role === '운영진';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // ⭐ 날짜 선택 상태 (기본값은 빈 문자열)
  const [customDate, setCustomDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [loading, setLoading] = useState(true);

  const [existingImages, setExistingImages] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/board-detail?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
          
          // ⭐ 기존 날짜(created_at)를 달력 입력창 형식(YYYY-MM-DDTHH:mm)으로 변환
          if (data.created_at) {
            const date = new Date(data.created_at);
            // 한국 시간 보정 (UTC -> KST)
            const offset = date.getTimezoneOffset() * 60000;
            const kstDate = new Date(date.getTime() - offset);
            setCustomDate(kstDate.toISOString().slice(0, 16));
          }
          
          if (data.image_url) {
            try { setExistingImages(data.image_url.startsWith('[') ? JSON.parse(data.image_url) : [data.image_url]); } 
            catch(e) { setExistingImages([data.image_url]); }
          }
          if (data.file_url) {
            try { setExistingFiles(data.file_url.startsWith('[') ? JSON.parse(data.file_url) : [data.file_url]); } 
            catch(e) { setExistingFiles([data.file_url]); }
          }
        } else {
          alert("게시글을 불러올 수 없습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  // ... (중간 핸들러 함수들: 이미지 추가/삭제 등은 기존과 동일) ...

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해 주세요.");
    setIsSubmitting(true);

    try {
      // (파일 업로드 로직 생략 - 기존과 동일)
      let uploadedNewImageUrls = [];
      let uploadedNewFileUrls = []; 
      // ... 업로드 프로세스 ...

      const finalImages = [...existingImages, ...uploadedNewImageUrls];
      const finalFiles = [...existingFiles, ...uploadedNewFileUrls];

      // ⭐ 서버로 보낼 데이터 묶음
      const response = await fetch('/api/board-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, 
          category, 
          title, 
          content,
          image_url: finalImages.length > 0 ? JSON.stringify(finalImages) : "", 
          file_url: finalFiles.length > 0 ? JSON.stringify(finalFiles) : "", 
          has_file: finalFiles.length > 0 ? 1 : 0, 
          // ⭐ 날짜 데이터 포함 (선택 안 했으면 null)
          custom_date: customDate ? new Date(customDate).toISOString() : null,
        }),
      });

      if (response.ok) {
        alert("성공적으로 수정되었습니다!");
        navigate(`/board/${category}/${id}`); 
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-extrabold mb-6 border-b pb-4">
              {boardNames[category]} 글 수정
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#317F81] outline-none" />
              </div>

              {/* ⭐ 관리자 전용 날짜 수정 (달력 방식) */}
              {isAdmin && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <label className="block text-sm font-bold text-yellow-900 mb-2">
                    👑 [관리자 전용] 작성 일자 수정 (달력 선택)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="px-4 py-2 border border-yellow-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-yellow-200"
                    />
                    <p className="text-xs text-yellow-700">
                      변경 시 게시판 목록에서 해당 날짜 순서로 재배치됩니다.
                    </p>
                  </div>
                </div>
              )}

              {/* ... (이미지/파일 첨부 및 내용 입력 구역은 기존과 동일) ... */}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                <button type="submit" disabled={isSubmitting} className={`px-8 py-3 font-bold text-white rounded-lg ${isSubmitting ? "bg-gray-400" : "bg-[#317F81]"}`}>
                  {isSubmitting ? "수정 중..." : "수정 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoardEdit;