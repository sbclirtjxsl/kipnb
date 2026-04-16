export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        // ⭐ custom_date를 추가로 받습니다.
        const { id, category, title, content, image_url, file_url, has_file, custom_date } = data;

        if (!id || !title || !content) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        let result;

        // ⭐ 상황 1: 관리자가 달력에서 날짜를 수정한 경우 (created_at도 함께 업데이트)
        if (custom_date) {
            result = await env.DB.prepare(
                `UPDATE board 
                 SET title = ?, content = ?, image_url = ?, file_url = ?, has_file = ?, created_at = ?
                 WHERE id = ? AND category = ?`
            ).bind(
                title, 
                content, 
                image_url || "", 
                file_url || "", 
                has_file || 0,
                custom_date, // 날짜 업데이트
                id,
                category
            ).run();
        } 
        // ⭐ 상황 2: 날짜를 수정하지 않은 경우 (기존 작성일 유지)
        else {
            result = await env.DB.prepare(
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
        }

        if (result.success) {
            return new Response(JSON.stringify({ message: "성공적으로 수정되었습니다." }), { status: 200 });
        } else {
            throw new Error("DB 업데이트 실패");
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}