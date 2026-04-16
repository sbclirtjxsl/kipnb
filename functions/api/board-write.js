export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        
        // ⭐ 1. 프론트에서 보낸 custom_date를 추가로 받습니다!
        const { 
            category, title, content, author_name, author_email, 
            has_file, image_url, file_url, custom_date 
        } = data;

        if (!category || !title || !content || !author_name || !author_email) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        // ⭐ 2. 작성일 결정 (관리자가 날짜를 골랐으면 그 날짜, 안 골랐으면 현재 시간)
        const finalCreatedAt = custom_date ? custom_date : new Date().toISOString();

        // ⭐ 3. DB 장부에 created_at(작성일) 칸을 추가해서 같이 저장합니다.
        const result = await env.DB.prepare(
            `INSERT INTO board (category, title, content, author_name, author_email, has_file, image_url, file_url, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            category, 
            title, 
            content, 
            author_name, 
            author_email, 
            has_file || 0,
            image_url || "", 
            file_url || "",
            finalCreatedAt // ⭐ 결정된 날짜를 DB에 꽂아 넣습니다!
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