export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        const { id, category, title, content, image_url, file_url, has_file } = data;

        if (!id || !title || !content) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        // 기존 게시글을 찾아서 내용을 통째로 업데이트(UPDATE) 합니다!
        const result = await env.DB.prepare(
            `UPDATE board 
             SET title = ?, content = ?, image_url = ?, file_url = ?, has_file = ?
             WHERE id = ? AND category = ?`
        ).bind(
            title, 
            content, 
            image_url || "", 
            file_url || "", 
            has_file || 0,
            id,
            category
        ).run();

        if (result.success) {
            return new Response(JSON.stringify({ message: "성공적으로 수정되었습니다." }), { status: 200 });
        } else {
            throw new Error("DB 업데이트 실패");
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}