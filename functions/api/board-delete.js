export async function onRequestDelete(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: "삭제할 글 번호가 없습니다." }), { status: 400 });
    }

    try {
        // ⭐ 핵심 변경: DELETE(완전 삭제) 대신 UPDATE(수정)를 써서 deleted_at 빈칸에 현재 시간을 채워 넣습니다!
        const result = await env.DB.prepare(
            "UPDATE board SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).bind(id).run();

        if (result.success) {
            return new Response(JSON.stringify({ message: "게시글이 휴지통으로 이동되었습니다." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            throw new Error("휴지통 이동 실패");
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}