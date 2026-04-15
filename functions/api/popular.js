export async function onRequestGet(context) {
    const { env } = context;

    try {
        // ⭐ 핵심 로직: 조회수(views) 내림차순 정렬, 조회수가 같다면 최신일(created_at) 내림차순 정렬!
        const sql = `
            SELECT id, category, title, views, created_at 
            FROM board 
            ORDER BY views DESC, created_at DESC 
            LIMIT 8
        `;
        const { results } = await env.DB.prepare(sql).all();

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}