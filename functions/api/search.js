export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const query = url.searchParams.get('q'); // 검색어 가져오기

    if (!query) {
        return new Response(JSON.stringify({ posts: [], total: 0 }), { status: 200 });
    }

    try {
        // ⭐ 모든 게시판에서 제목이나 내용에 검색어가 포함된 글을 찾습니다 (최신순 50개)
        const sql = `
            SELECT id, category, title, author_name, created_at, views, has_file, image_url 
            FROM board 
            WHERE title LIKE ? OR content LIKE ? 
            ORDER BY created_at DESC LIMIT 50
        `;
        const searchTerm = `%${query}%`;
        const { results } = await env.DB.prepare(sql).bind(searchTerm, searchTerm).all();

        return new Response(JSON.stringify({ posts: results, total: results.length }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}