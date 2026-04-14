export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        // ⭐ 프론트에서 보낸 file_url을 여기서 꼭 받아야 합니다!
        const { category, title, content, author_name, author_email, has_file, image_url, file_url } = data;

        if (!category || !title || !content || !author_name || !author_email) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        // ⭐ DB 장부에 file_url을 기록합니다.
        const result = await env.DB.prepare(
            `INSERT INTO board (category, title, content, author_name, author_email, has_file, image_url, file_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            category, 
            title, 
            content, 
            author_name, 
            author_email, 
            has_file || 0,
            image_url || "", 
            file_url || "" // 진짜 파일 주소 저장!
        ).run();

        if (result.success) {
            return new Response(JSON.stringify({ message: "성공" }), { status: 200 });
        } else {
            throw new Error("DB 저장 실패");
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}