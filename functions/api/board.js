export async function onRequestGet(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') || 'notice';
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let query, countQuery, params;

        if (category === 'archive') {
            query = `SELECT * FROM board WHERE has_file = 1 AND title LIKE ? AND deleted_at IS NULL ORDER BY id DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE has_file = 1 AND title LIKE ? AND deleted_at IS NULL`;
            params = [`%${search}%`];
        } else {
            query = `SELECT * FROM board WHERE category = ? AND title LIKE ? AND deleted_at IS NULL ORDER BY id DESC LIMIT ? OFFSET ?`;
            countQuery = `SELECT COUNT(*) as total FROM board WHERE category = ? AND title LIKE ? AND deleted_at IS NULL`;
            params = [category, `%${search}%`];
        }

        const totalResult = await env.DB.prepare(countQuery).bind(...params).first();
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