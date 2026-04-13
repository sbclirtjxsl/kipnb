export async function onRequestDelete(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: "삭제할 글 번호가 없습니다." }), { status: 400 });
    }

    try {
        const result = await env.DB.prepare(
            "DELETE FROM board WHERE id = ?"
        ).bind(id).run();

        if (result.success) {
            return new Response(JSON.stringify({ message: "게시글이 삭제되었습니다." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            throw new Error("DB 삭제 실패");
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}