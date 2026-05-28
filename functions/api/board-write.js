export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        
        // ⭐ 1. 프론트에서 보낸 custom_date와 access_level을 추가로 받습니다!
        const { 
            category, title, content, author_name, author_email, 
            has_file, image_url, file_url, custom_date, access_level 
        } = data;

        if (!category || !title || !content || !author_name || !author_email) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        // ⭐ 2. 권한 레벨 숫자 변환 (값이 없으면 0: 전체 공개)
        const safeAccessLevel = access_level ? parseInt(access_level, 10) : 0;

        // 3. 작성일 결정 (관리자가 날짜를 골랐으면 그 날짜, 안 골랐으면 현재 시간)
        const finalCreatedAt = custom_date ? custom_date : new Date().toISOString();

        // ⭐ 4. DB 장부에 created_at(작성일)과 access_level(접근 권한)을 같이 저장합니다.
        const result = await env.DB.prepare(
            `INSERT INTO board (category, title, content, author_name, author_email, has_file, image_url, file_url, created_at, access_level)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            category, 
            title, 
            content, 
            author_name, 
            author_email, 
            has_file || 0,
            image_url || "", 
            file_url || "",
            finalCreatedAt, 
            safeAccessLevel // ⭐ 파싱한 권한 레벨 삽입
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