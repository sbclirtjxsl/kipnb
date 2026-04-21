// functions/api/board.js 수정본

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

        if (category === 'search') {
            query = `SELECT * FROM board WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE title LIKE ?`;
            params = [`%${search}%`, limit, offset];
            countParams = [`%${search}%`];
        } 
        // ⭐ 수정된 부분: 자료실(archive) 로직
        // 카테고리가 'archive'이거나 (첨부파일이 있으면서 문의상담이 아닌 경우)를 필터링합니다.
        else if (category === 'archive') {
            query = `SELECT * FROM board WHERE (category = 'archive' OR (has_file = 1 AND category != 'qna')) AND title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE (category = 'archive' OR (has_file = 1 AND category != 'qna')) AND title LIKE ?`;
            params = [`%${search}%`, limit, offset];
            countParams = [`%${search}%`];
        }
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