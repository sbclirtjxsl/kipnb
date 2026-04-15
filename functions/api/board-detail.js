export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id'));
    
    // ⭐ 프론트에서 "조회수 올려줘!"라는 신호(increment)를 보냈는지 확인합니다.
    const increment = url.searchParams.get('increment'); 

    if (!id) {
        return new Response(JSON.stringify({ error: "게시글 ID가 없습니다." }), { status: 400 });
    }

    try {
        // ⭐ 신호가 'true'일 때만 조회수를 올립니다! (새로고침 방어의 핵심)
        if (increment === 'true') {
            await env.DB.prepare('UPDATE board SET views = views + 1 WHERE id = ?').bind(id).run();
        }

        const post = await env.DB.prepare('SELECT * FROM board WHERE id = ?').bind(id).first();

        if (!post) {
            return new Response(JSON.stringify({ error: "존재하지 않거나 삭제된 게시글입니다." }), { status: 404 });
        }

        const prevPost = await env.DB.prepare(
            'SELECT id, title FROM board WHERE category = ? AND id < ? ORDER BY id DESC LIMIT 1'
        ).bind(post.category, id).first();

        const nextPost = await env.DB.prepare(
            'SELECT id, title FROM board WHERE category = ? AND id > ? ORDER BY id ASC LIMIT 1'
        ).bind(post.category, id).first();

        const responseData = {
            ...post,
            prevPost: prevPost || null,
            nextPost: nextPost || null
        };

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}