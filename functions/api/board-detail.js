export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: "게시글 ID가 없습니다." }), { status: 400 });
    }

    try {
        // ⭐ SELECT * 를 통해 image_url, file_url 등 모든 칸의 데이터를 다 가져옵니다!
        const stmt = env.DB.prepare('SELECT * FROM board WHERE id = ?').bind(id);
        const post = await stmt.first();

        if (post) {
            return new Response(JSON.stringify(post), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ error: "존재하지 않거나 삭제된 게시글입니다." }), { status: 404 });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}