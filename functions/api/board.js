export async function onRequestGet(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    
    // 주소창에서 카테고리, 페이지, 검색어를 읽어옵니다.
    const category = searchParams.get('category') || 'notice';
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let query, countQuery, params;

        // 💡 질문자님의 기획: '자료실(archive)'은 카테고리에 상관없이 파일(has_file=1)이 있는 모든 글을 보여줍니다.
        if (category === 'archive') {
            query = `SELECT * FROM board WHERE has_file = 1 AND title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE has_file = 1 AND title LIKE ?`;
            params = [`%${search}%`];
        } else {
            query = `SELECT * FROM board WHERE category = ? AND title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE category = ? AND title LIKE ?`;
            params = [category, `%${search}%`];
        }

        // 1. 전체 개수 조회 (페이지네이션용)
        const totalResult = await env.DB.prepare(countQuery).bind(...params).first();
        
        // 2. 실제 게시글 목록 조회
        const { results } = await env.DB.prepare(query).bind(...params, limit, offset).all();

        return new Response(JSON.stringify({
            posts: results,
            total: totalResult.total
        }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}