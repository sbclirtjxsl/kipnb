export async function onRequestGet(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let query;
        let countQuery;
        let params;
        let countParams;

        // 1. 통합 검색일 경우: 전체 게시판을 뒤집니다.
        if (category === 'search') {
            query = `SELECT * FROM board WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE title LIKE ?`;
            params = [`%${search}%`, limit, offset];
            countParams = [`%${search}%`];
        } 
        // ⭐ 2. 추가된 부분 (자료실): 카테고리가 'archive'이거나 첨부파일(has_file=1)이 있는 글을 모두 가져옵니다!
        else if (category === 'archive') {
            query = `SELECT * FROM board WHERE (category = 'archive' OR has_file = 1) AND title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE (category = 'archive' OR has_file = 1) AND title LIKE ?`;
            params = [`%${search}%`, limit, offset];
            countParams = [`%${search}%`];
        }
        // 3. 일반 게시판일 경우: 해당 카테고리만 뒤집니다.
        else {
            query = `SELECT * FROM board WHERE category = ? AND title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE category = ? AND title LIKE ?`;
            params = [category, `%${search}%`, limit, offset];
            countParams = [category, `%${search}%`];
        }

        const { results } = await env.DB.prepare(query).bind(...params).all();
        const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();

        return new Response(JSON.stringify({
            posts: results || [],
            total: countResult.total || 0
        }), { status: 200 });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}