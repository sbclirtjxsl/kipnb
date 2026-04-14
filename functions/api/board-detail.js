export async function onRequestGet(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    
    // 프론트엔드에서 요청한 글 번호(id)를 가져옵니다.
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: "글 번호가 없습니다." }), { status: 400 });
    }

    try {
        // 지하 DB(D1)에서 해당 번호의 글 딱 1개만 찾아옵니다. (.first() 사용)
        const post = await env.DB.prepare(
            "SELECT * FROM board WHERE id = ?"
        ).bind(id).first();

        if (!post) {
            return new Response(JSON.stringify({ error: "게시글을 찾을 수 없습니다." }), { status: 404 });
        }

        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}